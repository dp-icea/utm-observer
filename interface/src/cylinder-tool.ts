import * as Cesium from "cesium";
import type { CylinderToolState } from "@/cylinder-tool-state.ts";
import type {
  CylinderVolumeSchema,
  CylinderVolumeModel,
  CylinderVolumeRequestPayload,
} from "@/volume.ts";

import { CylinderVolumeState, CylinderVolumeStateColors } from "@/volume.ts";

const SCALE = 2.0;
const WHEEL_ACCELERATION = 1.0;
const MAX_HEIGHT = 120.0;
const INITIAL_HEIGHT = 50.0;
const INITIAL_RADIUS = 50.0;
const GUIDE_ENTITY_OFFSET = 0.0;

export class CylinderTool {
  private viewer: Cesium.Viewer;
  private handler: Cesium.ScreenSpaceEventHandler;
  private annotations: Cesium.LabelCollection;
  private floatingHeightLabel?: Cesium.Label;
  private state: CylinderToolState;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    this.annotations = viewer.scene.primitives.add(
      new Cesium.LabelCollection(),
    );

    this.state = {
      addedRegions: [],
      isActive: true,
      isSelecting: false,
    };

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Remove default double-click behavior
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    );

    // Left click handler
    this.handler.setInputAction(
      (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        this.handleLeftClick(event);
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );

    // Mouse move handler
    this.handler.setInputAction(
      (event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        this.handleMouseMove(event);
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    );

    // Wheel handler
    this.handler.setInputAction((delta: number) => {
      this.handleWheel(delta);
    }, Cesium.ScreenSpaceEventType.WHEEL);
  }

  private handleLeftClick(
    event: Cesium.ScreenSpaceEventHandler.PositionedEvent,
  ): void {
    this.handleSelectEntity(event);

    if (!this.state.isActive) return;

    if (!Cesium.defined(this.state.draftModel)) {
      this.startCylinderCreation(event);
    } else {
      this.finishCylinderCreation();
    }
  }

  private startCylinderCreation(
    event: Cesium.ScreenSpaceEventHandler.PositionedEvent,
  ): void {
    const ray = this.viewer.camera.getPickRay(event.position);

    if (!Cesium.defined(ray)) {
      console.error("Failed to get pick ray from camera.");
      return;
    }

    const groundPosition = this.viewer.scene.globe.pick(ray, this.viewer.scene);

    if (!Cesium.defined(groundPosition)) {
      return;
    }

    this.state.draftModel = {
      center: Cesium.Cartographic.fromCartesian(groundPosition),
      radius: INITIAL_RADIUS,
      height: INITIAL_HEIGHT,
      state: CylinderVolumeState.DRAFT,
    };

    // Create max cylinder (guide)
    this.state.guideEntity = this.viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(this.state.draftModel.center),
      cylinder: {
        length: this.getCylinderLength(MAX_HEIGHT),
        topRadius: this.state.draftModel.radius + GUIDE_ENTITY_OFFSET,
        bottomRadius: this.state.draftModel.radius + GUIDE_ENTITY_OFFSET,
        material:
          CylinderVolumeStateColors[CylinderVolumeState.DRAFT].withAlpha(0.01),
      },
    });

    // Create main cylinder - changed to YELLOW
    this.state.draftEntity = this.viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(this.state.draftModel.center),
      cylinder: {
        length: this.getCylinderLength(this.state.draftModel.height),
        topRadius: this.state.draftModel.radius,
        bottomRadius: this.state.draftModel.radius,
        material:
          CylinderVolumeStateColors[CylinderVolumeState.DRAFT].withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
      },
    });

    this.floatingHeightLabel = this.annotations.add({
      position: groundPosition,
      text: `${this.state.draftModel.height.toFixed(2)} m`,
      showBackground: true,
      font: "14px monospace",
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    });

    // Disable zoom on wheel while creating cylinder
    this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.PINCH,
    ];
  }

  private finishCylinderCreation(): void {
    if (!this.state.draftModel) {
      console.error("finishCylinderCreation called without draft model");
      return;
    }

    this.state.draftModel.entity = this.state.draftEntity;
    this.state.addedRegions.push(this.state.draftModel);

    this.viewer.entities.remove(this.state.guideEntity);
    this.state.draftModel = null;
    this.state.draftEntity = null;
    this.state.guideEntity = null;

    this.annotations.remove(this.floatingHeightLabel);
    this.floatingHeightLabel = undefined;

    // Re-enable zoom on wheel
    this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ];
  }

  private handleMouseMove(
    movement: Cesium.ScreenSpaceEventHandler.MotionEvent,
  ): void {
    if (!this.state.draftModel) return;

    console.log(this.viewer.entities.values);

    if (this.state.draftEntity) console.log(this.state.draftEntity.id);

    const hitEntity = this.viewer.scene.pick(movement.endPosition);
    if (
      !Cesium.defined(hitEntity) ||
      (hitEntity.id !== this.state.guideEntity &&
        hitEntity.id !== this.state.draftEntity)
    )
      return;

    const hitPosition = this.viewer.scene.pickPosition(movement.endPosition);
    if (!Cesium.defined(hitPosition)) return;

    const hitCartographicPosition =
      Cesium.Cartographic.fromCartesian(hitPosition);
    const groundCartographicPosition = this.state.draftModel.center;

    this.state.draftModel.height =
      hitCartographicPosition.height - groundCartographicPosition.height;
    const heightText = `${this.state.draftModel.height.toFixed(2)} m`;

    // Update label
    if (this.floatingHeightLabel)
      this.annotations.remove(this.floatingHeightLabel);

    this.floatingHeightLabel = this.annotations.add({
      position: hitPosition,
      text: heightText,
      showBackground: true,
      font: "14px monospace",
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    });

    if (this.state.draftEntity) {
      this.viewer.entities.remove(this.state.draftEntity);
    }

    this.state.draftEntity = this.viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(this.state.draftModel.center),
      cylinder: {
        length: this.getCylinderLength(this.state.draftModel.height),
        topRadius: this.state.draftModel.radius,
        bottomRadius: this.state.draftModel.radius,
        material:
          CylinderVolumeStateColors[CylinderVolumeState.DRAFT].withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
      },
    });
  }

  private handleWheel(delta: number): void {
    if (!Cesium.defined(this.state.draftModel)) return;

    this.state.draftModel.radius += Math.sign(delta) * WHEEL_ACCELERATION;

    // Update max cylinder
    if (this.state.guideEntity) {
      this.viewer.entities.remove(this.state.guideEntity);
      this.state.guideEntity = this.viewer.entities.add({
        position: Cesium.Cartographic.toCartesian(this.state.draftModel.center),
        cylinder: {
          length: this.getCylinderLength(MAX_HEIGHT),
          topRadius: this.state.draftModel.radius + GUIDE_ENTITY_OFFSET,
          bottomRadius: this.state.draftModel.radius + GUIDE_ENTITY_OFFSET,
          material:
            CylinderVolumeStateColors[CylinderVolumeState.DRAFT].withAlpha(
              0.01,
            ),
        },
      });

      // Update main cylinder - keep YELLOW during creation
      if (this.state.draftEntity)
        this.viewer.entities.remove(this.state.draftEntity);
      this.state.draftEntity = this.viewer.entities.add({
        position: Cesium.Cartographic.toCartesian(this.state.draftModel.center),
        cylinder: {
          length: this.getCylinderLength(this.state.draftModel.height),
          topRadius: this.state.draftModel.radius,
          bottomRadius: this.state.draftModel.radius,
          material:
            CylinderVolumeStateColors[CylinderVolumeState.DRAFT].withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK,
        },
      });
    }
  }

  private updateCylinderColor(
    model: CylinderVolumeModel,
    color: Cesium.Color,
  ): void {
    if (!model.entity) return;

    this.viewer.entities.remove(model.entity);
    model.entity = this.viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(model.center),
      cylinder: {
        length: this.getCylinderLength(model.height),
        topRadius: model.radius,
        bottomRadius: model.radius,
        material: color.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
      },
    });
  }

  private createEntityDescription(model: CylinderVolumeModel): Cesium.Property {
    let description =
      `<table class="cesium-infoBox-defaultTable"><tbody>` +
      `<tr><th>Longitude</th><td>${model.center.longitude}</td></tr>` +
      `<tr><th>Latitude</th><td>${model.center.latitude}</td></tr>` +
      `<tr><th>Radius</th><td>${model.radius}</td></tr>` +
      `<tr><th>Height</th><td>${model.height}</td></tr>` +
      `<tr><th>State</th><td>${model.state}</td></tr>`;

    if (model.confirmedVolume) {
      description +=
        `<tr><th>Altitude Lower</th><td>${model.confirmedVolume.volume.altitude_lower.value}</td></tr>` +
        `<tr><th>Altitude Upper</th><td>${model.confirmedVolume.volume.altitude_upper.value}</td></tr>` +
        `<tr><th>Time Start</th><td>${model.confirmedVolume.time_start.value}</td></tr>` +
        `<tr><th>Time End</th><td>${model.confirmedVolume.time_end.value}</td></tr>`;
    }

    description += `</tbody></table>`;

    return description as unknown as Cesium.Property;
  }

  private showErrorMessage(model: CylinderVolumeModel, message: string): void {
    // Create a temporary error label
    const errorLabel = this.annotations.add({
      position: Cesium.Cartographic.toCartesian(model.center),
      text: `ERROR: ${message}`,
      showBackground: true,
      backgroundColor: Cesium.Color.RED.withAlpha(0.8),
      fillColor: Cesium.Color.WHITE,
      font: "16px monospace",
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      pixelOffset: new Cesium.Cartesian2(0, -50),
    });

    // Remove error message after 5 seconds
    setTimeout(() => {
      this.annotations.remove(errorLabel);
    }, 5000);
  }

  async submitVolumeRequest(startTime: string, endTime: string): Promise<void> {
    // model is the last draft model from the state.addedregions
    if (this.state.addedRegions.length === 0) {
      throw new Error("No cylinder regions available to submit.");
    }

    // Last available draft model
    const modelIndex = this.state.addedRegions.findIndex(
      (model) => model.state === CylinderVolumeState.DRAFT,
    );
    if (modelIndex === -1) {
      throw new Error("No draft model available to submit.");
    }

    const model = this.state.addedRegions[modelIndex];

    const payload: CylinderVolumeRequestPayload = {
      volume: {
        outline_circle: {
          center: {
            lng: model.center.longitude,
            lat: model.center.latitude,
          },
          radius: {
            value: model.radius,
            units: "M",
          },
        },
        altitude_lower: {
          value: model.center.height,
          reference: "W84",
          units: "M",
        },
        altitude_upper: {
          value: model.center.height + model.height,
          reference: "W84",
          units: "M",
        },
      },
      time_start: {
        value: startTime,
        format: "RFC3339",
      },
      time_end: {
        value: endTime,
        format: "RFC3339",
      },
    };

    try {
      const confirmedResponse = await this.apiService.submitFlightPlan(payload);
      this.updateCylinderColor(
        model,
        CylinderVolumeStateColors[CylinderVolumeState.ACCEPTED],
      );
      model.state = CylinderVolumeState.ACCEPTED;
      model.confirmedVolume = confirmedResponse.data.details
        .volumes[0] as CylinderVolumeSchema;
    } catch (error: any) {
      // Error occurred
      this.updateCylinderColor(
        model,
        CylinderVolumeStateColors[CylinderVolumeState.ERROR],
      );
      model.state = CylinderVolumeState.ERROR;

      if (error.response && error.response.status === 409) {
        // Conflict error - parse the specific error message
        const errorData = error.response.data;
        let errorMessage =
          "Flight plan conflicts with existing constraints or operational intents";

        if (errorData.detail && errorData.detail.message) {
          errorMessage = errorData.detail.message;
        }

        this.showErrorMessage(model, errorMessage);
        console.error("Conflict error:", errorData);
      } else {
        // Other errors
        const errorMessage = error.message || "Unknown error occurred";
        this.showErrorMessage(model, errorMessage);
        console.error("Error submitting volume request:", error);
      }

      throw error;
    }
  }

  cleanRequestedRegions(): void {
    // Remove all regions that are in REQUESTED state
    this.state.addedRegions.forEach((model) => {
      if (model.state === CylinderVolumeState.REQUESTED) {
        if (model.entity) {
          this.viewer.entities.remove(model.entity);
        }
      }
    });

    this.state.addedRegions = this.state.addedRegions.filter(
      (model) => model.state !== CylinderVolumeState.REQUESTED,
    );
  }

  drawConflictRegion(region: CylinderVolumeSchema): void {
    const center = new Cesium.Cartographic(
      region.volume.outline_circle.center.lng,
      region.volume.outline_circle.center.lat,
      region.volume.altitude_lower.value,
    );

    const radius = region.volume.outline_circle.radius.value;

    const height =
      region.volume.altitude_upper.value - region.volume.altitude_lower.value;

    const model: CylinderVolumeModel = {
      center: center,
      radius: radius,
      height: height,
      state: CylinderVolumeState.REQUESTED,
      confirmedVolume: region,
    };

    model.entity = this.viewer.entities.add({
      position: Cesium.Cartographic.toCartesian(center),
      cylinder: {
        length: this.getCylinderLength(height),
        topRadius: radius,
        bottomRadius: radius,
        material: Cesium.Color.GREY.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.RED,
      },
    });

    this.state.addedRegions.push(model);
  }

  private handleSelectEntity(
    event: Cesium.ScreenSpaceEventHandler.PositionedEvent,
  ): void {
    if (!this.state.isSelecting) return;

    const pickedObject = this.viewer.scene.pick(event.position);

    if (!Cesium.defined(pickedObject) || !pickedObject.id) {
      return;
    }

    const pickedEntity = pickedObject.id as Cesium.Entity;

    this.state.addedRegions.forEach((model) => {
      if (model.entity && model.entity.id === pickedEntity.id) {
        model.entity.description = this.createEntityDescription(model);
        console.log("Selected model:", model);
      }
    });
  }

  activateSelecting(): void {
    this.state.isSelecting = true;
  }

  deactivateSelecting(): void {
    this.state.isSelecting = false;
  }

  activate(): void {
    this.state.isActive = true;
  }

  deactivate(): void {
    this.state.isActive = false;

    // Clean up any active drawing state
    if (this.state.draftEntity) {
      this.viewer.entities.remove(this.state.draftEntity);
      this.state.draftEntity = undefined;
    }

    if (this.state.guideEntity) {
      this.viewer.entities.remove(this.state.guideEntity);
      this.state.guideEntity = undefined;
    }

    if (this.floatingHeightLabel) {
      this.annotations.remove(this.floatingHeightLabel);
      this.floatingHeightLabel = undefined;
    }

    this.state.draftModel = undefined;

    // Re-enable zoom on wheel
    this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ];
  }

  private getCylinderLength(height: number): number {
    return SCALE * height;
  }

  destroy(): void {
    this.handler.destroy();
  }
}

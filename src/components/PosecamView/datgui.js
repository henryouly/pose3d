import { SupportedModels } from '@tensorflow-models/pose-detection';
import * as dat from 'dat.gui';
import { useEffect, useState } from 'react';
import * as params from './params';

function DatGui(_props) {
  const [model, setModel] = useState(SupportedModels.BlazePose)

  useEffect(() => {
    const gui = new dat.GUI({ width: 300 });
    gui.domElement.id = 'gui';
    // The camera folder contains options for video settings.
    const cameraFolder = gui.addFolder('Camera');
    const fpsController = cameraFolder.add(params.STATE.camera, 'targetFPS');
    fpsController.onFinishChange((_) => {
      params.STATE.isTargetFPSChanged = true;
    });
    const sizeController = cameraFolder.add(
      params.STATE.camera, 'sizeOption', Object.keys(params.VIDEO_SIZE));
    sizeController.onChange(_ => {
      params.STATE.isSizeOptionChanged = true;
    });
    cameraFolder.open();

    // The model folder contains options for model selection.
    const modelFolder = gui.addFolder('Model');
    params.STATE.model = model;

    const modelController = modelFolder.add(
      params.STATE, 'model', Object.values(SupportedModels));
    modelController.onChange(_ => {
      params.STATE.isModelChanged = true;
      showModelConfigs(modelFolder);
      showBackendConfigs(backendFolder);
    });
    showModelConfigs(modelFolder, "full");
    modelFolder.open();

    const backendFolder = gui.addFolder('Backend');
    showBackendConfigs(backendFolder);
    backendFolder.open();
  })

  function showModelConfigs(folderController, type) {
    // Clean up model configs for the previous model.
    // The first constroller under the `folderController` is the model
    // selection.
    const fixedSelectionCount = 1;
    while (folderController.__controllers.length > fixedSelectionCount) {
      folderController.remove(
        folderController
          .__controllers[folderController.__controllers.length - 1]);
    }

    switch (params.STATE.model) {
      case SupportedModels.PoseNet:
        addPoseNetControllers(folderController);
        break;
      case SupportedModels.MoveNet:
        addMoveNetControllers(folderController, type);
        break;
      case SupportedModels.BlazePose:
        addBlazePoseControllers(folderController, type);
        break;
      default:
        alert(`Model ${params.STATE.model} is not supported.`);
    }
  }

  // The PoseNet model config folder contains options for PoseNet config
  // settings.
  function addPoseNetControllers(modelConfigFolder) {
    params.STATE.modelConfig = { ...params.POSENET_CONFIG };

    modelConfigFolder.add(params.STATE.modelConfig, 'maxPoses', [1, 2, 3, 4, 5]);
    modelConfigFolder.add(params.STATE.modelConfig, 'scoreThreshold', 0, 1);
  }

  // The MoveNet model config folder contains options for MoveNet config
  // settings.
  function addMoveNetControllers(modelConfigFolder, type) {
    params.STATE.modelConfig = { ...params.MOVENET_CONFIG };
    params.STATE.modelConfig.type = type != null ? type : 'lightning';

    const typeController = modelConfigFolder.add(
      params.STATE.modelConfig, 'type', ['lightning', 'thunder']);
    typeController.onChange(_ => {
      // Set isModelChanged to true, so that we don't render any result during
      // changing models.
      params.STATE.isModelChanged = true;
    });

    modelConfigFolder.add(params.STATE.modelConfig, 'scoreThreshold', 0, 1);
  }

  // The BlazePose model config folder contains options for BlazePose config
  // settings.
  function addBlazePoseControllers(modelConfigFolder, type) {
    params.STATE.modelConfig = { ...params.BLAZEPOSE_CONFIG };
    params.STATE.modelConfig.type = type != null ? type : 'full';

    const typeController = modelConfigFolder.add(
      params.STATE.modelConfig, 'type', ['lite', 'full', 'heavy']);
    typeController.onChange(_ => {
      // Set isModelChanged to true, so that we don't render any result during
      // changing models.
      params.STATE.isModelChanged = true;
    });

    modelConfigFolder.add(params.STATE.modelConfig, 'scoreThreshold', 0, 1);
  }

  function showBackendConfigs(folderController) {
    // Clean up backend configs for the previous model.
    const fixedSelectionCount = 0;
    while (folderController.__controllers.length > fixedSelectionCount) {
      folderController.remove(
        folderController
          .__controllers[folderController.__controllers.length - 1]);
    }
    const backends = params.MODEL_BACKEND_MAP[params.STATE.model];
    // The first element of the array is the default backend for the model.
    params.STATE.backend = backends[0];
    const backendController =
      folderController.add(params.STATE, 'backend', backends);
    backendController.name('runtime-backend');
    backendController.onChange(async backend => {
      params.STATE.isBackendChanged = true;
    });
  }

  return (
    <>
    </>
  );
}

export default DatGui
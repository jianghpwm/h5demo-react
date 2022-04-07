import React, { useEffect, useState, useRef } from "react";
import sdk from "qcloud-iotexplorer-h5-panel-sdk";
import { Card, ActionCard } from "../components/Card";
import {
  HeadBoolPanel,
  HeadEnumPanel,
  HeadNumberPanel,
} from "../components/HeadPanels";
import {
  NumberPanelControl,
  EnumPanelControl,
  BoolPanelControl,
  BoolBtnPanel,
} from "../components/DeviceDataModal";
import { useDeviceData } from "../hooks/useDeviceData";
import { StandardBleConnector } from "../StandardBleDemo/components/StandardBleConnector";
import { PropertyList } from "./PropertyList";
import { DeviceDetailBtn } from "./DeviceDetailBtn";
import { ManualLayoutPropertyList } from "./ManualLayoutPropertyList";
import { PropertyBoolList } from "./PropertyBoolList";
import { PropertyActionList } from "./PropertyActionList";
import "./DevicePanel.less";

const windowHeight =
  window.innerHeight || document.documentElement.clientHeight;
let sofaModeName = "";

function PropertyCard({
  templateConfig,
  value,
  onClick,
  disabled: outerDisabled,
  direction,
}) {
  const disabled =
    Boolean(outerDisabled) || templateConfig.mode.indexOf("w") === -1;
  const { name, define: { type, mapping, start, unit } = {} } = templateConfig;

  switch (type) {
    case "int":
    case "float":
      if (value === undefined) {
        value = start;
      }
      value += unit ? unit : "";
      break;
    case "bool":
    case "enum": {
      if (value === undefined || !(value in mapping)) {
        value = Object.keys(mapping)[0];
      }
      value = mapping[value];
      break;
    }
  }

  return (
    <Card
      icon="create"
      title={name}
      desc={value}
      onClick={onClick}
      disabled={disabled}
      direction={direction}
    />
  );
}

function PropertyActionCard({
  templateConfig,
  value,
  onClick,
  disabled: outerDisabled,
  direction,
}) {
  const disabled =
    Boolean(outerDisabled) || templateConfig.mode.indexOf("w") === -1;
  const { name, define: { type, mapping, start, unit } = {} } = templateConfig;

  switch (type) {
    case "int":
    case "float":
    case "bool":
    case "enum":{
      if (value === undefined || !(value in mapping)) {
        value = Object.keys(mapping)[0];
      }
      value = mapping[value];
      break;
    }
  }

  return (
    <ActionCard
      icon="create"
      title={name}
      desc={value}
      onClick={onClick}
      disabled={disabled}
      direction={direction}
    />
  );
}

export function DevicePanel() {
  const [state, { onDeviceDataChange, onDeviceStatusChange }] = useDeviceData(
    sdk
  );

  const isStandardBleDevice = sdk.isStandardBleDevice;
  const [numberPanelInfo, setNumberPanelInfo] = useState({
    visible: false,
    templateId: "",
  });

  const [boolPanelInfo, setBoolPanelInfo] = useState({
    visible: false,
    templateId: "",
  });

  const [enumPanelInfo, setEnumPanelInfo] = useState({
    visible: false,
    templateId: "",
  });

  useEffect(() => {
    sdk.setShareConfig({
      title: sdk.displayName,
    });
  }, []);

  // WebSocket 监听
  useEffect(() => {
    const handleWsControl = ({ deviceId, deviceData }) => {
      if (deviceId === sdk.deviceId) {
        onDeviceDataChange(deviceData);
      }
    };

    const handleWsReport = ({ deviceId, deviceData }) => {
      if (deviceId === sdk.deviceId) {
        onDeviceDataChange(deviceData);
      }
    };

    const handleWsStatusChange = ({ deviceId, deviceStatus }) => {
      if (deviceId === sdk.deviceId) {
        onDeviceStatusChange(deviceStatus);
      }
    };

    sdk
      .on("wsControl", handleWsControl)
      .on("wsReport", handleWsReport)
      .on("wsStatusChange", handleWsStatusChange);

    return () => {
      sdk
        .off("wsControl", handleWsControl)
        .off("wsReport", handleWsReport)
        .off("wsStatusChange", handleWsStatusChange);
    };
  }, []);

  useEffect(() => {
    // 检查固件更新，若有可升级固件，且设备在线，则弹出提示
    const doCheckFirmwareUpgrade = async () => {
      try {
        const upgradeInfo = await sdk.checkFirmwareUpgrade({
          silent: false, // 设置为 true 则只检查，不弹出提示
        });
        console.log("firmware upgrade info", upgradeInfo);
      } catch (err) {
        console.error("checkFirmwareUpgrade fail", err);
      }
    };
    doCheckFirmwareUpgrade();
  }, []);

  const onControlDeviceData = (id, value) => {
    sdk.controlDeviceData({ [id]: value });
    state.templateList.forEach(element => {
      if (element.id == id) {
        sofaModeName = element.name;
        console.log('element=',element);
      } else {
        sdk.controlDeviceData({ [element.id]: 0 });
      }
    });
    console.log("controlDeviceData", id, value);
  }

  const onControlPanelItem = (item) => {
    console.log("onControlPanelItem", item);

    const {
      id,
      define: { type },
    } = item;

    switch (type) {
      case "int":
      case "float":
        setNumberPanelInfo({
          visible: true,
          templateId: id,
        });
        break;
      case "bool":
        setBoolPanelInfo({
          visible: true,
          templateId: id,
        });
      case "enum": {
        setEnumPanelInfo({
          visible: true,
          templateId: id,
        });
      }
    }
  };

  // 一般非在线状态（state.deviceStatus === 0）需要禁止控制
  const disabled = false; // !state.deviceStatus;

  // 指定要展示大按钮的属性标识符，为 null 则取第一个属性
  let headPanelTemplateId = null;
  if (!headPanelTemplateId && state.templateList.length > 0) {
    headPanelTemplateId = state.templateList[0].id;
  }

  const renderHeadPanel = () => {
    return null;
  };

  const renderPropertyCard = ({ templateConfig, cardDirection }) => (
    <PropertyCard
      key={templateConfig.id}
      templateConfig={templateConfig}
      value={state.deviceData[templateConfig.id]}
      disabled={disabled}
      direction={cardDirection}
      onClick={() => onControlPanelItem(templateConfig)}
    />
  );

  const renderPropertyBoolCard = ({ templateConfig, cardDirection }) => {
    const itemTemplateConfig = state.templateMap[templateConfig.id];
    if (!itemTemplateConfig) return null;

    const {
      id,
      define: { type },
    } = itemTemplateConfig;
    const value = state.deviceData[id];

    switch (type) {
      case "bool":
        return (
          <BoolBtnPanel
            templateConfig={itemTemplateConfig}
            onChange={(value) => onControlDeviceData(id, value)}
            value={value}
            disabled={disabled}
          />
        );
      case "enum":
        return (
          <PropertyActionCard
            key={templateConfig.id}
            templateConfig={templateConfig}
            value={state.deviceData[templateConfig.id]}
            disabled={disabled}
            direction={cardDirection}
            onClick={() => onControlPanelItem(templateConfig)}
          />
        )
    }
  };
  
  const renderPropertyActionCard = ({ templateConfig, cardDirection }) => {
    const itemTemplateConfig = state.templateMap[templateConfig.id];
    if (!itemTemplateConfig) return null;

    const {
      id,
      define: { type },
    } = itemTemplateConfig;
    const value = state.deviceData[id];

    switch (type) {
      case "enum":
        return (
          <PropertyActionCard
            key={templateConfig.id}
            templateConfig={templateConfig}
            value={state.deviceData[templateConfig.id]}
            disabled={disabled}
            direction={cardDirection}
            onClick={() => onControlPanelItem(templateConfig)}
          />
        )
    }
  };

  // 设置为 true 切换为手动排列属性示例
  const showManualLayoutPropertyList = true;

  return (
    <div>
      {isStandardBleDevice && (
        <StandardBleConnector familyId={sdk.familyId} deviceId={sdk.deviceId} />
      )}
      <div
        className="device-panel clear-margin"
        style={{ minHeight: `${windowHeight}px` }}
      >
        <DeviceDetailBtn />

        <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
          <div style={{display: 'flex', width: '20%', justifyContent: 'center'}} />
          <div style={{display: 'flex', width: '60%', justifyContent: 'center'}}>
            <img className="photo" lazy-load="true" src='https://uploadbeta.com/share-image/ihk' />            
          </div>
          <div style={{display: 'flex', width: '20%', justifyContent: 'center'}} />
        </div>

        <div style={{display: 'flex', justifyContent: 'left'}}>
          <div style={{display: 'flex', width: '5%', justifyContent: 'center'}} />
          <div className="card-left">在线</div>
          <div className="card-right">{sofaModeName==""?"模式未设定":sofaModeName}</div>
        </div>

        {renderHeadPanel()}

        {state.templateList.length > 0 && (
          <div className="card-layout">
            {!showManualLayoutPropertyList ? (
              // 自动排列
              <PropertyList
                templateList={state.templateList}
                renderProperty={renderPropertyCard}
                layoutType="wide" // 长按钮:wide, 中按钮:medium, 小按钮:mini
              />
            ) : (
              // 手动排列
              <PropertyBoolList
                templateList={state.templateList}
                renderProperty={renderPropertyBoolCard}
              />
            )}
          </div>
        )}

        {state.templateList.length > 0 && (
          <div className="card-layout">
            <PropertyActionList
                templateList={state.templateList}
                renderProperty={renderPropertyActionCard}
            />
          </div>
        )}

        {boolPanelInfo.visible && (
          <BoolPanelControl
            visible={true}
            templateConfig={state.templateMap[boolPanelInfo.templateId]}
            value={state.deviceData[boolPanelInfo.templateId]}
            onChange={(value) =>
              onControlDeviceData(boolPanelInfo.templateId, value)
            }
            onClose={() => setBoolPanelInfo({ visible: false, templateId: "" })}
          />
        )}

        {enumPanelInfo.visible && (
          <EnumPanelControl
            visible={true}
            templateConfig={state.templateMap[enumPanelInfo.templateId]}
            value={state.deviceData[enumPanelInfo.templateId]}
            onChange={(value) =>
              onControlDeviceData(enumPanelInfo.templateId, value)
            }
            onClose={() => setEnumPanelInfo({ visible: false, templateId: "" })}
          />
        )}

      </div>
    </div>
  );
}

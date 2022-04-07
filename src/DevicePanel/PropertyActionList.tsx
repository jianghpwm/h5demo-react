import React, { useMemo } from 'react';
import { Col, Row } from '../components/Grid';

export interface PropertyActionListProps {
  templateList: TemplatePropertyConfig[];
  renderProperty: (options: {
    templateConfig: TemplatePropertyConfig;
    cardDirection: string;
  }) => React.ReactNode;
}

// 手动排列属性卡片示例
export function PropertyActionList({
  templateList,
  renderProperty,
}: PropertyActionListProps) {
  // 取前3个属性作为示例
  console.log('templateList.length:=',templateList.length)
  const templateListToShow = useMemo(() => {
    return [
      templateList[6 % templateList.length],
      templateList[7 % templateList.length],
      templateList[8 % templateList.length],
    ];
  }, [templateList]);
  let downSign = ">"

  return (
    <>

      <Row className="card">  { /* 一行显示一个属性（长按钮） */ }
        <Col span={3}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="circle-left-btn">{downSign}</div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="card-center">{templateListToShow[0].name}</div>
          </div>
          {/* {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'row'
          })} */}
        </Col>
        <Col span={3}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
          <div className="circle-right-btn">{downSign}</div>
          </div>
        </Col>
      </Row>

      <Row className="card">  { /* 一行显示一个属性（长按钮） */ }
        <Col span={3}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="circle-left-btn">{downSign}</div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="card-center">{templateListToShow[1].name}</div>
          </div>
          {/* {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'row'
          })} */}
        </Col>
        <Col span={3}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
          <div className="circle-right-btn">{downSign}</div>
          </div>
        </Col>
      </Row>

      
      <Row className="card">  { /* 一行显示一个属性（长按钮） */ }
        <Col span={3}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="circle-left-btn">{downSign}</div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="card-center">{templateListToShow[2].name}</div>
          </div>
          {/* {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'row'
          })} */}
        </Col>
        <Col span={3}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
          <div className="circle-right-btn">{downSign}</div>
          </div>
        </Col>
      </Row>
      
    </>
  );
}

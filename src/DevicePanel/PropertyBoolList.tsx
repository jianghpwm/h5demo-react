import React, { useMemo } from 'react';
import { Col, Row } from '../components/Grid';

export interface PropertyBoolListProps {
  templateList: TemplatePropertyConfig[];
  renderProperty: (options: {
    templateConfig: TemplatePropertyConfig;
    cardDirection: string;
  }) => React.ReactNode;
}

// 手动排列属性卡片示例
export function PropertyBoolList({
  templateList,
  renderProperty,
}: PropertyBoolListProps) {
  // 取前3个属性作为示例
  const templateListToShow = useMemo(() => {
    return [
      templateList[0 % templateList.length],
      templateList[1 % templateList.length],
      templateList[2 % templateList.length],
      templateList[3 % templateList.length],
      templateList[4 % templateList.length],
      templateList[5 % templateList.length],
      templateList[6 % templateList.length],
      templateList[7 % templateList.length],
      templateList[8 % templateList.length],
    ];
  }, [templateList]);

  return (
    <>

      <Row>  { /* 一行显示三个属性（小按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'column'
          })}
        </Col>

        <Col>
          {renderProperty({
            templateConfig: templateListToShow[1],
            cardDirection: 'column'
          })}
        </Col>

        <Col>
          {renderProperty({
            templateConfig: templateListToShow[2],
            cardDirection: 'column'
          })}
        </Col>
      </Row>

      <Row>  { /* 一行显示三个属性（小按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[3],
            cardDirection: 'column'
          })}
        </Col>

        <Col>
          {renderProperty({
            templateConfig: templateListToShow[4],
            cardDirection: 'column'
          })}
        </Col>

        <Col>
          {renderProperty({
            templateConfig: templateListToShow[5],
            cardDirection: 'column'
          })}
        </Col>
      </Row>

      <Row>  { /* 一行显示一个属性（长按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[6],
            cardDirection: 'row'
          })}
        </Col>
      </Row>
      <Row>  { /* 一行显示一个属性（长按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[7],
            cardDirection: 'row'
          })}
        </Col>
      </Row>
      <Row>  { /* 一行显示一个属性（长按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[8],
            cardDirection: 'row'
          })}
        </Col>
      </Row>
    </>
  );
}

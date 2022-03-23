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
      templateList[0 % templateList.length],
      templateList[1 % templateList.length],
      templateList[2 % templateList.length],
    ];
  }, [templateList]);

  return (
    <>

      <Row>  { /* 一行显示一个属性（长按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'row'
          })}
        </Col>
      </Row>

      <Row>  { /* 一行显示一个属性（长按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'row'
          })}
        </Col>
      </Row>

      <Row>  { /* 一行显示一个属性（长按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'row'
          })}
        </Col>
      </Row>

    </>
  );
}

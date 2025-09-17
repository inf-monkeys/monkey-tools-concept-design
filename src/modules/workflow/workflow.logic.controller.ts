import {
  MonkeyToolCategories,
  MonkeyToolDisplayName,
  MonkeyToolIcon,
  MonkeyToolInput,
  MonkeyToolName,
  MonkeyToolOutput
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow/logic')
@UseGuards(new AuthGuard())
export class WorkflowLogicController {
  constructor(private readonly service: WorkflowService) { }

  @Post('seat-pressure-calculation')
  @MonkeyToolName('seat-pressure-calculation')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:calculator')
  @MonkeyToolDisplayName({
    "en-US": "Seat Pressure Calculation",
    "zh-CN": "座椅压力计算"
  })
  @MonkeyToolInput([
    {
      "name": "7bfpqd",
      "description": "",
      "displayName": {
        "zh-CN": "身高"
      },
      "required": false,
      "type": "number"
    },
    {
      "name": "ppfqcz",
      "description": "",
      "displayName": {
        "zh-CN": "体重"
      },
      "required": false,
      "type": "number"
    },
    {
      "name": "pppnqz",
      "description": "",
      "displayName": {
        "zh-CN": "坐姿"
      },
      "required": false,
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async seatPressureCalculation(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54afe77af2f30b3165a7f',
      inputData: body,
    });
  }

  @Post('pressure-distribution-simulation')
  @MonkeyToolName('pressure-distribution-simulation')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:square-stack')
  @MonkeyToolDisplayName({
    "en-US": "Pressure Distribution Simulation",
    "zh-CN": "压力分布模拟"
  })
  @MonkeyToolInput([
    {
      "name": "mcwzfb",
      "displayName": {
        "zh-CN": "杨氏模量"
      },
      "type": "number"
    },
    {
      "name": "gq98zz",
      "displayName": {
        "zh-CN": "泊松比"
      },
      "type": "number"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async pressureDistributionSimulation(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54b161e9863dc270974a4',
      inputData: body,
    });
  }

  @Post('pressure-distribution-visualization')
  @MonkeyToolName('pressure-distribution-visualization')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:view')
  @MonkeyToolDisplayName({
    "en-US": "Pressure Distribution Visualization",
    "zh-CN": "压力分布可视化"
  })
  @MonkeyToolInput([
    {
      "name": "8w78rm",
      "displayName": {
        "zh-CN": "杨氏模量"
      },
      "type": "number"
    },
    {
      "name": "ct7gmk",
      "description": "",
      "displayName": {
        "zh-CN": "泊松比"
      },
      "required": false,
      "type": "number"
    },
    {
      "name": "br8rcp",
      "displayName": {
        "zh-CN": "身高"
      },
      "type": "number"
    },
    {
      "name": "mbgttf",
      "displayName": {
        "zh-CN": "体重"
      },
      "type": "number"
    },
    {
      "name": "zp9km9",
      "displayName": {
        "zh-CN": "坐姿"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async pressureDistributionVisualization(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54b334eafb473f3d20663',
      inputData: body,
    });
  }

  @Post('summary-of-triz-problems-workflow')
  @MonkeyToolName('summary-of-triz-problems-workflow')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:file-check')
  @MonkeyToolDisplayName({
    "en-US": "TRIZ Problem Summary",
    "zh-CN": "TRIZ问题总结"
  })
  @MonkeyToolInput([
    {
      "name": "88zfqc",
      "displayName": {
        "zh-CN": "问题参数"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async summaryOfTrizProblemsWorkflow(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54cc0597dd7103b735a04',
      inputData: body,
    });
  }

  @Post('triz-parameter-transformation-workflow')
  @MonkeyToolName('triz-parameter-transformation-workflow')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:coins-exchange')
  @MonkeyToolDisplayName({
    "en-US": "TRIZ Parameter Transformation",
    "zh-CN": "TRIZ参数转化"
  })
  @MonkeyToolInput([
    {
      "name": "qrn7q8",
      "displayName": {
        "zh-CN": "问题参数"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async trizParameterTransformationWorkflow(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54d0c1716a12bf9807ea3',
      inputData: body,
    });
  }

  @Post('triz-contradiction-analysis-workflow')
  @MonkeyToolName('triz-contradiction-analysis-workflow')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:git-pull-request-arrow')
  @MonkeyToolDisplayName({
    "en-US": "TRIZ Contradiction Analysis",
    "zh-CN": "TRIZ矛盾分析"
  })
  @MonkeyToolInput([
    {
      "name": "6wqppd",
      "displayName": {
        "zh-CN": "TRIZ矛盾"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async trizContradictionAnalysisWorkflow(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54d259388fa9ea217a247',
      inputData: body,
    });
  }

  @Post('analysis-of-triz-principles-workflow')
  @MonkeyToolName('analysis-of-triz-principles-workflow')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:align-justify')
  @MonkeyToolDisplayName({
    "en-US": "TRIZ Principle Analysis",
    "zh-CN": "TRIZ原则分析"
  })
  @MonkeyToolInput([
    {
      "name": "6wqppd",
      "description": "",
      "displayName": {
        "zh-CN": "TRIZ参数"
      },
      "required": false,
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async analysisOfTrizPrinciplesWorkflow(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54d3ba5d7485a11f0f73f',
      inputData: body,
    });
  }

  @Post('analysis-of-triz-solutions-workflow')
  @MonkeyToolName('analysis-of-triz-solutions-workflow')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:file-question')
  @MonkeyToolDisplayName({
    "en-US": "TRIZ Solution Analysis",
    "zh-CN": "TRIZ解决方案分析"
  })
  @MonkeyToolInput([
    {
      "name": "6wqppd",
      "description": "",
      "displayName": {
        "zh-CN": "TRIZ参数"
      },
      "required": false,
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async analysisOfTrizSolutionsWorkflow(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54d557a70e35ba47c61c9',
      inputData: body,
    });
  }

  @Post('product-function-analysis-workflow')
  @MonkeyToolName('product-function-analysis-workflow')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:proportions')
  @MonkeyToolDisplayName({
    "en-US": "Product Function Analysis",
    "zh-CN": "产品功能分析"
  })
  @MonkeyToolInput([
    {
      "name": "cdqnmf",
      "description": "",
      "displayName": {
        "zh-CN": "前置分析"
      },
      "required": false,
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async productFunctionAnalysisWorkflow(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54de0538d2b48770e7379',
      inputData: body,
    });
  }

  @Post('analysis-of-product-design-behavior-workflow')
  @MonkeyToolName('analysis-of-product-design-behavior-workflow')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:codesandbox')
  @MonkeyToolDisplayName({
    "en-US": "Product Design Behavior Analysis",
    "zh-CN": "产品设计行为分析"
  })
  @MonkeyToolInput([
    {
      "name": "zbgjbw",
      "displayName": {
        "zh-CN": "前置分析"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async analysisOfProductDesignBehaviorWorkflow(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54df120daa42e0beb650a',
      inputData: body,
    });
  }

  @Post('product-structure-analysis-workflow')
  @MonkeyToolName('product-structure-analysis-workflow')
  @MonkeyToolCategories(['logic'])
  @MonkeyToolIcon('lucide:align-horizontal-distribute-center')
  @MonkeyToolDisplayName({
    "en-US": "Product Structure Analysis",
    "zh-CN": "产品结构分析"
  })
  @MonkeyToolInput([
    {
      "name": "6h6npf",
      "displayName": {
        "zh-CN": "前置分析"
      },
      "type": "string"
    }
  ])
  @MonkeyToolOutput([
    {
      name: 'data',
      displayName: {
        'zh-CN': '结果',
        'en-US': 'Result',
      },
      required: true,
      type: 'string',
    },
  ])
  public async productStructureAnalysisWorkflow(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e034e2dc9518c984834',
      inputData: body,
    });
  }
}

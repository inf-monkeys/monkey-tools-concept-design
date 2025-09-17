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

@Controller('workflow/demand')
@UseGuards(new AuthGuard())
export class WorkflowDemandController {
  constructor(private readonly service: WorkflowService) { }

  @Post('design_objective_summary')
  @MonkeyToolName('design_objective_summary')
  @MonkeyToolCategories(['demand'])
  @MonkeyToolIcon('lucide:chart_bar')
  @MonkeyToolDisplayName({
    "en-US": "Design Objective Summary",
    "zh-CN": "设计目标总结"
  })
  @MonkeyToolInput([
    {
      name: 'goals',
      "description": {
        "zh-CN": "一系列具体、完整、清晰的设计目标"
      },
      "displayName": {
        "en-US": "Goals",
        "zh-CN": "设计约束"
      },
      required: true,
      type: 'string',
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
  public async designObjectiveSummary(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b548b4d1a4c28c031e312a',
      inputData: body,
    });
  }

  @Post('market_analysis_actor')
  @MonkeyToolName('market_analysis_actor')
  @MonkeyToolCategories(['demand'])
  @MonkeyToolIcon('lucide:notebook_pen')
  @MonkeyToolDisplayName({
    "en-US": "MarketAnalysisActor",
    "zh-CN": "市场调研"
  })
  @MonkeyToolInput([
    {
      "name": "dtg86d",
      "description": "",
      "displayName": {
        "en-US": "background description",
        "zh-CN": "背景描述"
      },
      "required": false,
      "type": "string"
    },
    {
      "name": "bdwj9t",
      "description": "",
      "displayName": {
        "en-US": "Research Subject",
        "zh-CN": "调研对象"
      },
      "required": false,
      "type": "string"
    },
    {
      "name": "mwfpgr",
      "displayName": {
        "en-US": "Features",
        "zh-CN": "特性"
      },
      "type": "string"
    },
    {
      "name": "7bj7dm",
      "description": "",
      "displayName": {
        "en-US": "Minimum number of surveys",
        "zh-CN": "比较竞品数量"
      },
      "required": false,
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
  public async marketAnalysisActor(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b548f1dd9e24bcc3987fc6',
      inputData: body,
    });
  }

  @Post('user_research')
  @MonkeyToolName('user_research')
  @MonkeyToolCategories(['demand'])
  @MonkeyToolIcon('lucide:user_pen')
  @MonkeyToolDisplayName({
    "en-US": "User Research",
    "zh-CN": "用户调研"
  })
  @MonkeyToolInput([
    {
      "name": "b6g769",
      "displayName": {
        "zh-CN": "背景描述"
      },
      "type": "string"
    },
    {
      "name": "jbjbgd",
      "displayName": {
        "en-US": "user group",
        "zh-CN": "用户群体"
      },
      "type": "string"
    },
    {
      "name": "9c7nwc",
      "displayName": {
        "en-US": "analytic product",
        "zh-CN": "分析产品"
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
  public async userResearch(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54a12ce1ff3494db8f180',
      inputData: body,
    });
  }

  @Post('requirement_analysis')
  @MonkeyToolName('requirement_analysis')
  @MonkeyToolCategories(['demand', 'logic'])
  @MonkeyToolIcon('lucide:activity')
  @MonkeyToolDisplayName({
    "en-US": "Requirement Analysis",
    "zh-CN": "需求分析"
  })
  @MonkeyToolInput([
    {
      "name": "zjkpp7",
      "displayName": {
        "zh-CN": "设计约束"
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
  public async requirementAnalysis(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54dccc7b49668f8f8e8c3',
      inputData: body,
    });
  }


  @Post('market_environment_analysis')
  @MonkeyToolName('market_environment_analysis')
  @MonkeyToolCategories(['demand'])
  @MonkeyToolIcon('lucide:atom')
  @MonkeyToolDisplayName({
    "en-US": "Market Environment Analysis",
    "zh-CN": "市场环境分析"
  })
  @MonkeyToolInput([
    {
      "name": "8npnpp",
      "displayName": {
        "en-US": "product information",
        "zh-CN": "产品信息"
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
  public async marketEnvironmentAnalysis(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e4204cc340c5d118bda',
      inputData: body,
    });
  }

  @Post('design_opportunity_analysis')
  @MonkeyToolName('design_opportunity_analysis')
  @MonkeyToolCategories(['demand', 'logic'])
  @MonkeyToolIcon('lucide:chart_spline')
  @MonkeyToolDisplayName({
    "en-US": "Design Opportunity Analysis",
    "zh-CN": "设计机会点分析"
  })
  @MonkeyToolInput([
    {
      "name": "dchzhq",
      "displayName": {
        "en-US": "analysis for competitive products",
        "zh-CN": "竞品分析"
      },
      "type": "string"
    },
    {
      "name": "6b97rj",
      "displayName": {
        "en-US": "environment analysis",
        "zh-CN": "环境分析"
      },
      "type": "string"
    },
    {
      "name": "rdzjmj",
      "displayName": {
        "en-US": "Generated Quantity",
        "zh-CN": "生成数量"
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
  public async designOpportunityAnalysis(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e55f587ab7d293a602f',
      inputData: body,
    });
  }

  @Post('user_scenario_analysis')
  @MonkeyToolName('user_scenario_analysis')
  @MonkeyToolCategories(['demand'])
  @MonkeyToolIcon('lucide:contact_round')
  @MonkeyToolDisplayName({
    "en-US": "User Scenario Analysis",
    "zh-CN": "用户场景分析"
  })
  @MonkeyToolInput([
    {
      "name": "pcrfqw",
      "description": "",
      "displayName": {
        "zh-CN": "竞品分析"
      },
      "required": false,
      "type": "string"
    },
    {
      "name": "c7kzgj",
      "displayName": {
        "zh-CN": "环境分析"
      },
      "type": "string"
    },
    {
      "name": "7hgd88",
      "displayName": {
        "zh-CN": "用户场景"
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
  public async userScenarioAnalysis(
    @Body() body: any,
  ) {
    return await this.service.requestWorkflow({
      workflowId: '68b54e69b7e1f2c0c453f0f7',
      inputData: body,
    });
  }
}

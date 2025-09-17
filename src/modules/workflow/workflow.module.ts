import { Module } from '@nestjs/common';
import { WorkflowDemandController } from './workflow.demand.controller';
import { WorkflowFeatureController } from './workflow.feature.controller';
import { WorkflowLogicController } from './workflow.logic.controller';
import { WorkflowPrototypeController } from './workflow.prototype.controller';
import { WorkflowService } from './workflow.service';

@Module({
  controllers: [WorkflowDemandController, WorkflowFeatureController, WorkflowLogicController, WorkflowPrototypeController],
  providers: [WorkflowService],
  imports: [],
})
export class WorkflowModule { }

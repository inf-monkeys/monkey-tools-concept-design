import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonMiddleware } from './common/middlewares/common.middleware';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ConceptDesignModule } from './modules/concept-design/concept-design.module';
import { PlotlyModule } from './modules/plotly/plotly.module';

@Module({
  imports: [ WorkflowModule, ConceptDesignModule, PlotlyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CommonMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

import { Module } from '@nestjs/common';
import { PlotlyController } from './plotly.controller';
import { PlotlyService } from './plotly.service';

@Module({
  controllers: [PlotlyController],
  providers: [PlotlyService],
  exports: [PlotlyService],
})
export class PlotlyModule {}

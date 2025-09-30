/**
 * 默认参数配置 - 对应不同的模型类型
 */

export const MODEL_0_PARAMS = {
  MAX_ANGLERADIANS: 90,
  MAX_BEAMNUM: 5,
  absolute_tolerance: 0.001,
  angle_tolerance_degrees: 1.0,
  local_blending: true,
  cap_mode: 'Round',
  fit_rail: true,
  is_smooth: 0,
  smooth_point_count: 200,
  smooth_degree: 4,
  skid_length: 300,
  skid_arc_radius_1: 140,
  skid_arc_angleRadians_1: 20,
  skid_arc_radius_2: 80,
  skid_arc_angleRadians_2: 50,
  is_skid_pipe: 1,
  skid_pipe_radius: 4,
  is_skid_shell: 0,
  skid_pipe_thickness: 2,
  is_skid_connected: 0,
  skid_bridge_radius_AtStart: 4,
  skid_bridge_height_AtStart: 30,
  skid_bridge_ext_angle_AtStart: 50,
  connect_reverse: 1,
  skid_bridge_radius_AtEnd: 4,
  skid_bridge_height_AtEnd: 30,
  skid_bridge_ext_angle_AtEnd: 50,
  skid_width: 20,
  skid_thickness: 10,
  skid_distance: 160,
  beam_length: 40,
  beam_height: 80,
  beam_radius: 4,
  beam_number: 4,
  beam_start_X: -100,
  beam_end_X: 100,
  is_beam_pipe: 1,
  beam_pipe_radius: 4,
  is_beam_shell: 0,
  beam_pipe_thickness: 2,
  plat_length: 100,
  plat_width: 80,
  plat_thickness: 10,
  is_plat_corner: 1,
  plat_radius: 20,
};

export const MODEL_1_PARAMS = {
  MAX_ANGLERADIANS: 90,
  MAX_LEGNUM: 5,
  absolute_tolerance: 0.001,
  angle_tolerance_degrees: 1.0,
  local_blending: true,
  cap_mode: 'Flat',
  fit_rail: true,
  is_smooth: 0,
  smooth_point_count: 200,
  smooth_degree: 4,
  global_offset: 0.05,
  is_curve_else_rod: 1,
  leg_angle: 90,
  leg_radius: 4,
  curve_radius: 180,
  leg_height: 80,
  foot_thickness: 20,
  foot_radius: 6,
  leg_number: 3,
  leg_distance_to_center: 20,
  leg_rotate: 0,
  plat_length: 100,
  plat_width: 80,
  plat_thickness: 10,
  is_plat_corner: 2,
  plat_radius: 20,
};

export const MODEL_2_PARAMS = {
  MAX_ANGLERADIANS: 90,
  MAX_LEGNUM: 4,
  absolute_tolerance: 0.001,
  angle_tolerance_degrees: 1.0,
  local_blending: true,
  cap_mode: 'Flat',
  fit_rail: true,
  is_smooth: 0,
  smooth_point_count: 200,
  smooth_degree: 4,
  global_offset: 0.05,
  is_hinge: 1,
  hinge_start_height: 40,
  hinge_radius: 1,
  hinge_leg_distance_AtPlat: 40,
  leg_number: 4,
  leg_rotate_offset: 0,
  leg_distance_to_center: 30,
  is_leg_pipe: 0,
  leg_radius: 2,
  leg_height: 80,
  leg_side_length: 2,
  leg_angle: 40,
  foot_thickness: 20,
  foot_radius: 6,
  plat_length: 100,
  plat_width: 80,
  plat_thickness: 10,
  is_plat_corner: 1,
  plat_radius: 20,
};

/**
 * 根据 modelid 获取默认参数
 */
export function getDefaultParams(modelid: number): Record<string, any> {
  switch (modelid) {
    case 0:
      return MODEL_0_PARAMS;
    case 1:
      return MODEL_1_PARAMS;
    case 2:
      return MODEL_2_PARAMS;
    default:
      return MODEL_1_PARAMS; // 默认返回模型1的参数
  }
}
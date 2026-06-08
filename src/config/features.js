// 功能开关配置 - 用于分阶段上线工具，避免草稿路由、下载/转换类高风险功能提前进入导航、sitemap 或公开索引
export const featureFlags = {
  // Analyzer 属于低风险工具，和现有 Player 页面平级开发与展示
  enableAnalyzerTools: true,
  // 高风险流处理草稿页当前只保留路由文件，不公开功能
  enableStreamToolDraftPages: false,
  // 高风险草稿页不进入 sitemap，后续真正上线前再按页面质量和政策风险逐个打开
  indexStreamToolDraftPages: false,
  // 高风险草稿页不进入 Header/Footer/Home 导航，避免审核期把主站定位推向下载站
  showStreamToolDraftsInNav: false,
};

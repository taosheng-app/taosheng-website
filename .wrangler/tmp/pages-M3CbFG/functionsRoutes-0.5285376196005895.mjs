import { onRequestGet as __api_latest_release_js_onRequestGet } from "D:\\projects\\github\\TaoSheng-Website\\functions\\api\\latest-release.js"

export const routes = [
    {
      routePath: "/api/latest-release",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_latest_release_js_onRequestGet],
    },
  ]
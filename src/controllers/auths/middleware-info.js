import globalVariable from "@/lib/global-variable";

export default async function MiddlewareInfo({ middleware = {} }) {
  if (middleware.error) {
    return middleware;
  }
  const dataAuth = middleware.data;
  const locationDashboard = {
    participant: "/participant",
    mentor: "/mentor",
    admin: "/admin",
  };
  const roleSlug = globalVariable.context_info.role_slug[
    dataAuth.user.profile.role
  ];
  return {
    data: {
      profile: dataAuth.user.profile,
      role: roleSlug,
      role_label: globalVariable.context_info.role_label[dataAuth.user.profile.role],
      dashboard: locationDashboard[roleSlug],
    },
  };
}
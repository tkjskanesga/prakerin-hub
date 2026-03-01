import db from "@/database/db";
import globalVariable from "@/lib/global-variable";
import { toAuthData, validateJWT } from "@/lib/jwt";
import logger from "@/lib/logger";
import { BucketOpenURL } from "@/lib/s3";

export default async function AuthMiddleware({ system = {} }) {
  const logaction = logger.child({ middleware: "auths" });
  // Get JWT
  const tokenJWT = String(
    system.cookies?.[globalVariable.authorization.name] || "",
  );
  // Validator JWT
  const validTokenJWT = validateJWT(tokenJWT);
  logaction.debug({ tokenJWT, validTokenJWT });
  if (!validTokenJWT) {
    return {
      redirect: "/login",
      error: "midauth:jwt-invalid",
    };
  }
  // Extract Data JWT
  const dataJwt = toAuthData(tokenJWT);
  logaction.debug({ dataJwt });
  if (dataJwt.error) {
    return {
      redirect: "/login",
      error: dataJwt.error,
    };
  }
  // Get Auth & Data Users
  const getAuth = await db.query.auths.findFirst({
    where: (auths, { eq }) => eq(auths.id, dataJwt.auth_id),
    with: {
      user: {
        columns: {
          password: false,
          created_at: false,
          updated_at: false,
          deleted_at: false,
          institutions_id: false,
          update_total: false,
        },
        with: {
          participantProfile: {
            columns: {
              user_id: false,
              created_at: false,
              updated_at: false,
              deleted_at: false,
            },
            with: {
              classes: {
                columns: {
                  institution_id: false,
                  created_at: false,
                  updated_at: false,
                  deleted_at: false,
                },
              },
            },
          },
          mentorProfile: {
            columns: {
              user_id: false,
              created_at: false,
              updated_at: false,
              deleted_at: false,
            },
          },
          institutionView: {
            columns: {
              created_at: false,
              updated_at: false,
              deleted_at: false,
            },
          },
        },
      },
    },
  });
  logaction.debug({ getAuth });
  if (!getAuth) {
    return {
      redirect: "/login",
      error: "midauth:auth-not-found",
    };
  }
  const userRoleType = String(
    globalVariable.context_info.role_slug[getAuth.user.role] || "unknown",
  );
  const userProfile = {
    auth: {
      id: getAuth.id,
      ip: getAuth.ip,
      location: getAuth.location,
      user_agent: getAuth.user_agent,
      created_at: getAuth.created_at,
      updated_at: getAuth.updated_at,
    },
    user: {
      profile: {
        id: getAuth.user.id,
        fullname: getAuth.user.fullname,
        picture_url: BucketOpenURL(getAuth.user.picture_url, "profile.png"),
        username: getAuth.user.username,
        email: getAuth.user.email,
        phone: getAuth.user.phone,
        role: getAuth.user.role,
        role_label: getAuth.user[userRoleType],
      },
      student: getAuth.user.participantProfile
        ? {
            ...getAuth.user.participantProfile,
            class_id: undefined,
            classes: undefined,
          }
        : null,
      class: getAuth.user.participantProfile?.classes
        ? {
            ...getAuth.user.participantProfile.classes,
          }
        : null,
      mentor: getAuth.user.mentorProfile
        ? {
            ...getAuth.user.mentorProfile,
            institution: getAuth.user.mentorProfile.institution,
          }
        : null,
      institution: getAuth.user.institutionView
        ? {
            ...getAuth.user.institutionView,
            icon: BucketOpenURL(getAuth.user.institutionView.icon, "icon.png"),
            type: globalVariable.context_info.school_type_slug[
              getAuth.user.institutionView.type
            ],
            status:
              globalVariable.context_info.school_status_slug[
                getAuth.user.institutionView.status
              ],
          }
        : null,
    },
  };
  logaction.debug({ userProfile });
  return {
    data: userProfile,
  };
}

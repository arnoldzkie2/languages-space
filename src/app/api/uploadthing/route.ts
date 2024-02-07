import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { badRequestRes, getSearchParams, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { UTApi } from "uploadthing/server";
import { NextRequest } from "next/server";

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

export const DELETE = async (req: NextRequest) => {

  const key = getSearchParams(req, 'key')

  try {

    if (key) {

      const utapi = new UTApi()

      const profile = await utapi.getFileUrls(key)
      if (profile.length > 0) {
        const deleteProfile = await utapi.deleteFiles(profile[0].key)
        if (!deleteProfile) return badRequestRes("Failed to delete profile")
      }

      return okayRes()
    }

    return notFoundRes('Profile Key')

  } catch (error) {
    console.log(error);
    return serverErrorRes(error)
  }

}
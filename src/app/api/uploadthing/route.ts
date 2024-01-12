import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { badRequestRes, notFoundRes, okayRes, serverErrorRes } from "@/utils/apiResponse";
import { UTApi } from "uploadthing/server";

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

export const DELETE = async (req: Request) => {

  const { searchParams } = new URL(req.url)

  const key = searchParams.get('key')

  try {

    if (key) {

      const utapi = new UTApi()

      const deleteProfile = await utapi.deleteFiles(key)
      if (!deleteProfile) return badRequestRes()

      return okayRes()
    }

    return notFoundRes('Profile Key')

  } catch (error) {
    console.log(error);
    return serverErrorRes(error)
  }

}
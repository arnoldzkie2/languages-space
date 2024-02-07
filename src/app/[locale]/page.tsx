import { redirect } from '@/lib/navigation'
import { getAuth } from '@/lib/nextAuth'
import { ADMIN, AGENT, CLIENT, SUPERADMIN, SUPPLIER } from '@/utils/constants'

const Page = async () => {

  const session = await getAuth()
  if (!session) return redirect('/auth')

  switch (session.user.type) {
    case ADMIN:
    case SUPERADMIN:
      return redirect('/admin');
    case CLIENT:
      return redirect('/client');
    case AGENT:
      return redirect('/agent/invite');
    case SUPPLIER:
      return redirect('/supplier/schedule');
    default:
      return redirect('/auth');
  }

}

export default Page
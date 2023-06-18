import SDCard from "../../components/shared/Card";
import HomeLink, { HomeLinkProps } from "../../components/userPanel/home/HomeLink";
import { useAppSelector } from "../../hooks/reduxHooks";
import { UserStatuses } from "../../models/shared.models";

const Home: React.FC = () => {
  const name = useAppSelector(state=>state.auth.name);
  const authState = useAppSelector(state=>state.auth);
  const links : HomeLinkProps[] = [
    {
      tilte: 'رویدادها',
      href:''
    },
    {
      tilte: 'قوانین و شرایط',
      href:''
    },
    {
      tilte: 'رویدادها',
      href:''
    },
    {
      tilte: 'قوانین و شرایط',
      href:''
    }
  ]
  const statusBgColorMap = new Map([
    [UserStatuses.AWAITING_COMPLETION, 'bg-yellow-300'],
    [UserStatuses.PENDING, 'bg-yellow-300'],
    [UserStatuses.ACTIVE, 'bg-green-200'],
    [UserStatuses.INACTIVE, 'bg-red-500'],
  ])
  return <SDCard className="flex justify-center">
    <main className="w-full max-w-xl flex flex-col justify-center">
      <div className="mb-6">
        <div className="text-center">
          <p className="mb-2 text-lg">{name}</p>
          <p className={`${statusBgColorMap.get(authState.userStatus)} text-xs  inline py-1 px-3 rounded-2xl`}>{authState.userStatusDisplay}</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {
          links.map((link,index)=>{
            return (
              <HomeLink key={index}  {...link} />
            )
          })
        }
      </div>
    </main>
  </SDCard>;
};
export default Home;
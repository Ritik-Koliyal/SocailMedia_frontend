import '../Styles/Profile.css'
import ProfileCard from './ProfileCard';
function Profile() {
  return (
    <>
      <div className="container col-6 ">
        <h2 className='p-2 ' > Profile</h2>
        <ProfileCard />
      </div>

    </>
  )
}
export default Profile;
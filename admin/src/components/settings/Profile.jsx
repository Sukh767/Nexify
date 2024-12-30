import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
	const { userInfo } = useSelector((state) => state.auth);
	//console.log(userInfo);

	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6'>
				<img
					src='https://randomuser.me/api/portraits/men/3.jpg'
					alt='Profile'
					className='rounded-full w-20 h-20 object-cover mr-4'
				/>

				<div>
					<h3 className='text-lg font-semibold text-gray-100'>{userInfo.first_name}{" "}{userInfo.last_name}</h3>
					<p className='text-gray-400'>{userInfo.email}</p>
				</div>
			</div>

			<button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 transition duration-200 w-full sm:w-auto'>
				<Link to='/settings/users/account'>
				View Profile
				</Link>
			</button>
		</SettingSection>
	);
};
export default Profile;

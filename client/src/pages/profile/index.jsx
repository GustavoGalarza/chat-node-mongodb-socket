import { useAppStore } from "@/store"

const Profile = () => {
    const { userInfo } = useAppStore();
    return (<div>Profile fees
        <div>Email:{userInfo.id}</div>
    </div>
    );
};

export default Profile 
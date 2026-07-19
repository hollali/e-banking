import HeaderBox from '@/components/headerBox';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import { getAccounts } from '@/lib/actions/bank.actions';
import ProfileForm from '@/components/ProfileForm';

const Profile = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <section className="my-banks">
        <HeaderBox title="Profile" subtext="Please sign in to view your profile." />
      </section>
    );
  }

  const accountsData = await getAccounts({ userId: loggedIn.$id });
  const accounts = accountsData?.data || [];

  return (
    <section className="my-banks">
      <HeaderBox title="Profile" subtext="Manage your account settings." />

      <div className="space-y-6">
        <ProfileForm user={loggedIn} accountsCount={accounts.length} />
      </div>
    </section>
  );
};

export default Profile;

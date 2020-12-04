import Header from '~/components/public/Header';
import { getSession, signOut } from 'next-auth/client';
import useUser from '~/lib/hooks/useUser';
import Sidebar from '~/components/public/user/Sidebar';
import { Col, Row, Spinner } from 'reactstrap';
import ProfileForm from '~/components/public/user/ProfileForm';

const Settings = ({ session }) => {
  let { user, isLoading, isError } = useUser(session);
  if (!isLoading && !isError) {
    if (user.status == 500) {
      signOut();
    }
  }
  return (
    <div>
      <Header />
      <main className="container pt-4">
        {isLoading && (
          <div className="mt-4 d-flex justify-content-center">
            <Spinner color="dark" />
          </div>
        )}
        {isError && (
          <small className="text-muted">Uhoh, we've hit an error.</small>
        )}
        {!isLoading && !isError && !user.data && (
          <small className="text-muted">Uhoh, we've hit an error.</small>
        )}
        {!isLoading && !isError && user.data && (
          <Row>
            <Col md="3">
              <Sidebar url="profile" />
            </Col>
            <Col>
              <ProfileForm user={user} session={session} />
            </Col>
          </Row>
        )}
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  // Get the user's session based on the request
  const session = await getSession(context);
  if (!session) {
    console.log("We've lost the session");
    // If no user, redirect to login
    return {
      props: {},
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // If there is a user, return the current session
  return { props: { session } };
}

export default Settings;

import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';

const KeepParamsLink = ({ href, children, ...props }) => {
  const { query } = useRouter();

  return (
    <Link href={{ pathname: href, query }} {...props}>
      <a>{children}</a>
    </Link>
  );
};

KeepParamsLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default KeepParamsLink;

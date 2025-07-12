import Hyperlink from '@/components/Hyperlink';
import Text from '@/components/Text';

const Footer = () => {
  return (
    <footer className="py-8 bg-darkblue">
      <div className="flex container mx-auto items-center">
        <div className="flex-1">TV Show Tracker</div>
        <Text>
          By{' '}
          <Hyperlink href="https://soucasaux.com" external>
            SCSX
          </Hyperlink>
          .{' '}
          <Hyperlink href="https://github.com/scsx/TV-Show-Tracker" external>
            Repo
          </Hyperlink>
          .
        </Text>
      </div>
    </footer>
  );
};

export default Footer;

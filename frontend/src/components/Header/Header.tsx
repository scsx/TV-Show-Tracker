import Hyperlink from '@/components/Hyperlink';
import Text from '@/components/Text';

const Header = () => {
  return (
    <header className="py-4 bg-muted">
      <div className="container flex">
        <Hyperlink href="/" className="group hover:no-underline">
          <Text className="text-3xl font-[900]">
            <span className="text-primary group-hover:text-white">TV</span>
            <span className="text-secondary group-hover:text-white">S</span>
            <span className="group-hover:text-white">T</span>
          </Text>
        </Hyperlink>
      </div>
    </header>
  );
};

export default Header;

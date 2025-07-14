import Hyperlink from '@/components/Hyperlink'
import Logo from '@/components/Logo'
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'
import { Button } from '@/components/ui/button'

const KitchenSink = () => {
  return (
    <PageLayout title="Kitchen Sink" subtitle="Component Test Page">
      {/* Btns */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          <Button size="sm">Small Button</Button>
          <Button size="lg">Large Button</Button>
          <Button size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </section>
      {/* Hyperlinks */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hyperlinks</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Hyperlink href="#">Default Link</Hyperlink>
          <Hyperlink href="#">Title Link (inherits color)</Hyperlink>
          <Hyperlink href="#">Icon Link</Hyperlink>
          <Hyperlink href="#" variant="unstyled">
            Unstyled Link
          </Hyperlink>
          <Hyperlink href="https://google.com" external>
            External Link
          </Hyperlink>
        </div>
      </section>
      {/* Text */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Texts</h2>
        <div>
          <Text variant="h1">Heading 1</Text>
          <Text variant="h2">Heading 2</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="h4">Heading 4</Text>
          <Text variant="h5">Heading 5</Text>
          <Text variant="h6">Heading 6</Text>
          <Text>Default Body Text.</Text>
          <Text className="text-muted-foreground">Muted Foreground Text.</Text>
        </div>
      </section>
      {/* Logo */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Logo</h2>
        <div className="flex gap-8 items-center">
          <Logo large />
          <Logo />
        </div>
      </section>
    </PageLayout>
  )
}

export default KitchenSink

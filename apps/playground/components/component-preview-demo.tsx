"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ComponentPreview,
  Input,
} from "@intelli/ui";

export const loginCardCode = `import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function LoginCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              defaultValue="m@example.com"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <a
                href="#"
                className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Login</Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}`;

export function LoginCardPreview() {
  return (
    <Card className="w-full max-w-sm" variant="outline">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </div>
        <Button variant="link" className="h-auto px-0 py-0 text-sm">
          Sign Up
        </Button>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-6">
          <div className="grid gap-2">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="m@example.com"
              defaultValue="m@example.com"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <label htmlFor="login-password" className="text-sm font-medium">
                Password
              </label>
              <a
                href="#"
                className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="login-password" type="password" />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Login</Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}

const codeOnlyExample = `export function Greeting({ name }: { name: string }) {
  return <p className="text-sm text-muted-foreground">Hello, {name}</p>
}`;

export function ComponentPreviewDemo() {
  return (
    <div className="space-y-8">
      <ComponentPreview code={loginCardCode} defaultShowCode={false}>
        <LoginCardPreview />
      </ComponentPreview>

      <div className="space-y-3">
        <p className="text-sm font-medium">Editable code panel</p>
        <p className="text-sm text-muted-foreground">
          Paste or edit source in the code panel — useful for docs, snippets, and
          copy-ready examples.
        </p>
        <ComponentPreview
          code={loginCardCode}
          editable
          defaultShowCode
          minPreviewHeight={240}
        >
          <LoginCardPreview />
        </ComponentPreview>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Code only</p>
        <ComponentPreview
          code={codeOnlyExample}
          language="tsx"
          defaultShowCode
          showViewCodeToggle={false}
        />
      </div>
    </div>
  );
}
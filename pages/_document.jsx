import Document, { Html, Head, Main, NextScript } from "next/document";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "@/components/ui/toaster";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head></Head>
        <body>
          <Theme>
            <Main />
            <NextScript />
          </Theme>
        </body>
      </Html>
    );
  }
}

export default MyDocument;

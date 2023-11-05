import Document, { Html, Head, Main, NextScript } from "next/document";
import { Theme } from "@radix-ui/themes";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
        </Head>
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

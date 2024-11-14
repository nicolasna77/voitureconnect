import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "loremflickr.com",
      "localhost",
      "cdn.pixabay.com",
      "lh3.googleusercontent.com",
    ],
  },
};
export default withNextIntl(nextConfig);

/* pages/_app.js */
import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import Header from "./components/Header";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;1,200&display=swap"
          rel="stylesheet"
        />
        <link
          href="assets/vendor/animate.css/animate.min.css"
          rel="stylesheet"
        />
        <link href="assets/vendor/aos/aos.css" rel="stylesheet" />
        <link
          href="assets/vendor/bootstrap/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link href="assets/vendor/icofont/icofont.min.css" rel="stylesheet" />
        <link
          href="assets/vendor/bootstrap-icons/bootstrap-icons.css"
          rel="stylesheet"
        />
        <link
          href="assets/vendor/boxicons/css/boxicons.min.css"
          rel="stylesheet"
        />

        <link
          href="assets/vendor/glightbox/css/glightbox.min.css"
          rel="stylesheet"
        />
        <link
          href="assets/vendor/swiper/swiper-bundle.min.css"
          rel="stylesheet"
        />

        <link href="assets/css/style.css" rel="stylesheet" />
      </Head>

      <header id="header" className="fixed-top d-flex align-items-cente">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">
          <a href="index.html" className="logo me-auto me-lg-0">
            <img
              src="assets/img/logo-main-nav.png"
              alt="logo"
              width="55px"
              height="40px"
            />
          </a>

          <nav id="navbar" className="navbar order-last order-lg-0 mx-center">
            <ul>
              <Link href="https://cosmoinfinitas-00.firebaseapp.com/">
                <a className="nav-link scrollto ">
                  <b>HOME</b>
                </a>
              </Link>
              <Link href="/">
                <a className="nav-link scrollto active">
                  <b>MARKETPLACE</b>
                </a>
              </Link>
              <Link href="/create-item">
                <a className="nav-link scrollto ">
                  <b>SELL COSMO NFT</b>
                </a>
              </Link>
              <Link href="/my-assets">
                <a className="nav-link scrollto">
                  <b>MY NFT</b>
                </a>
              </Link>
              <Link href="/creator-dashboard">
                <a className="nav-link scrollto">
                  <b>CREATORS DASHBOARD</b>
                </a>
              </Link>
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
          </nav>
        </div>
      </header>
      <Header />
      <Component {...pageProps} />
      <Script src="assets/vendor/jquery.easing/jquery.easing.min.js" />
      <Script src="assets/vendor/aos/aos.js" />
      <Script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js" />
      <Script src="assets/vendor/glightbox/js/glightbox.min.js" />
      <Script src="assets/vendor/isotope-layout/isotope.pkgd.min.js" />
      <Script src="assets/vendor/swiper/swiper-bundle.min.js" />
      <Script src="assets/js/main.js" />
    </>
  );
}

export default MyApp;

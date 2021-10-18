import React from "react";

const Header = () => {
  return (
    <>
      <section id="hero" className="d-flex align-items-center">
        <div
          className="container position-relative text-center text-lg-start"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <div className="row">
            <div className="col-lg-8">
              <h1>
                CosmoInfinitas <span>Marketplace</span>
              </h1>
              <h2>
                Welcome to the virtual world’s one-stop-shop for the very best
                digital assets.
              </h2>

              <div className="btns">
                <a
                  href="#book-a-table"
                  className="btn-book animated fadeInUp scrollto"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;

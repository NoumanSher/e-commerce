import React, { memo, useMemo } from "react";

const ProductsCatgories = () => {
  const catgoriesProducts = useMemo(() => ["all", "women", "men", "kids"], []);
  return (
    <div>
      <div>
        <h1 className="text-[26px] xl:text-[32px] !font-normal leading-[1.2em] xl:leading-[1.5em] !mb-1 text-center">
          Trending
        </h1>
      </div>
      <div className="xl:mt-8">
        <ul className="flex flex-wrap justify-center mb-[1rem] mt-2">
          {catgoriesProducts.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className="nav-link mx-[25px]  mt-[11px] pb-[9px]   leading-[1.375em] text-[14px] xl:text-[16px] !font-medium uppercase"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default memo(ProductsCatgories);

import React from 'react';

// Auxiliar para extraer los colores del operador
const getOperatorColors = (color: string) => {
  if (color.includes('yoigo') || color.includes('#B026FF') || color.includes('fuchsia')) {
    return { primary: '#B026FF', border: 'rgba(176, 38, 255, 0.2)', bgGlow: 'rgba(176, 38, 255, 0.04)' };
  }
  if (color.includes('orange') || color.includes('#FF7900') || color.includes('orange')) {
    return { primary: '#FF7900', border: 'rgba(255, 121, 0, 0.2)', bgGlow: 'rgba(255, 121, 0, 0.04)' };
  }
  if (color.includes('lowi') || color.includes('#0A0A0A') || color.includes('#FFFFFF') || color.includes('#E50015')) {
    const isWhite = color.includes('#FFFFFF');
    return { 
      primary: isWhite ? '#FFFFFF' : '#0A0A0A', 
      border: isWhite ? 'rgba(255, 255, 255, 0.2)' : 'rgba(10, 10, 10, 0.2)', 
      bgGlow: isWhite ? 'rgba(255, 255, 255, 0.04)' : 'rgba(10, 10, 10, 0.04)' 
    };
  }
  return { primary: '#E60000', border: 'rgba(230, 0, 0, 0.2)', bgGlow: 'rgba(230, 0, 0, 0.04)' };
};

// ================= LOGOS DE COMPAÑÍAS OFICIALES (SVG ALTA FIDELIDAD) =================

// Logo Yoigo
export const YoigoLogo: React.FC<{ className?: string; color?: string }> = ({ className = "h-8", color }) => {
  return (
    <svg
      viewBox="0 0 248 76.576"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="yoigo-gradient" x1="468.78571" y1="528.12708" x2="226.07143" y2="528.12708" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#400b81" />
          <stop offset="0.43419102" stopColor="#8d1383" />
          <stop offset="1" stopColor="#f31e7f" />
        </linearGradient>
      </defs>
      <path
        d="m 197.42407,51.55475 c -2.32534,-2.78186 -3.91379,-10.4887 -4.67421,-9.80354 -0.63437,0.57158 -0.61568,8.97997 -0.68934,12.20058 m 0,0 c -0.0984,4.30052 -3.95932,12.73113 -7.19063,15.70115 -6.62642,6.0906 -20.5368,8.56281 -32.6059,5.79486 -11.96926,-2.74506 -14.93719,-5.54465 -13.35294,-12.59562 1.38007,-6.14224 3.26071,-7.67951 7.34254,-6.00191 6.65909,2.73683 14.04765,4.26759 17.48551,3.62264 3.81674,-0.71602 8.2609,-4.50172 8.2609,-7.03694 0,-1.36311 -0.7202,-1.48467 -4.75,-0.80173 -6.64648,1.1264 -14.9674,0.54549 -18.89709,-1.31927 -12.93596,-6.13852 -16.30536,-25.25892 -6.94396,-39.40496 5.48721,-8.29173 17.26957,-11.96341 25.99903,-8.10195 l 4.73786,2.09578 2.86992,-2.12183 c 2.41495,-1.78544 3.76187,-2.02977 8.49615,-1.54115 7.56683,0.78097 8.48809,1.7333 8.48809,8.77436 0,3.20019 0.3599,12.82668 0.79977,13.09853 0.43988,0.27186 2.35238,-8.37799 4.25,-10.92825 5.32518,-7.1566 11.2643,-9.73386 22.42917,-9.73306 7.65052,5.6e-4 9.87291,0.4 14.62802,2.62919 9.72296,4.55812 13.89304,12.47328 13.89304,26.37016 0,10.06121 -1.83908,15.72271 -6.73772,20.74171 -5.25696,5.38611 -10.92223,7.26592 -21.76228,7.22098 -11.16064,-0.0463 -16.49997,-2.1891 -22.07593,-8.85973 m 30.36043,-11.93292 c 2.94996,-2.94995 3.4019,-10.21042 0.87558,-14.06607 -2.30754,-3.52175 -8.51866,-5.10791 -12.87351,-3.28757 -4.34415,1.81587 -5.87279,3.81597 -6.41564,8.39438 -0.5774,4.86987 1.26703,8.3303 5.64298,10.58707 4.39547,2.26684 9.53048,1.6123 12.77059,-1.62781 z M 171.8,36.75179 c 0.69804,-0.69804 1.2,-4.04444 1.2,-8 0,-7.6466 -1.91708,-10.8 -6.56574,-10.8 -6.02261,0 -9.3584,3.65261 -9.40246,10.29546 -0.043,6.48499 3.0167,9.70454 9.22275,9.70454 2.39,0 4.88545,-0.54 5.54545,-1.2 z m -157.67924,36.13731 c -2.95858,-0.52693 -7.34608,-1.82809 -9.75,-2.89145 -3.92745,-1.7373 -4.37076,-2.27896 -4.37076,-5.34041 0,-8.71876 3.89847,-12.36067 9.90599,-9.25406 9.78554,5.06029 23.09401,2.55885 23.09401,-4.34073 0,-1.74566 -0.64553,-1.84906 -8.48852,-1.35976 -13.37277,0.8343 -20.0727,-2.79183 -23.37338,-12.65012 -1.41439,-4.22443 -1.48287,-20.00981 -0.11804,-27.20658 1.55507,-8.19982 3.16272,-9.29481 12.11552,-8.252 l 7.36442,0.8578 0,14.13402 c 0,12.49186 0.22133,14.37986 1.90499,16.25 2.42803,2.69695 6.97804,2.73295 9.63476,0.0762 1.87157,-1.87157 2.01968,-3.10807 1.79623,-14.99623 -0.15522,-8.25859 0.14781,-13.34781 0.83574,-14.03574 1.29057,-1.29057 16.27419,-1.38237 17.54903,-0.10752 0.48973,0.48972 1.12748,5.11789 1.41724,10.28482 0.28975,5.16693 -0.70391,15.37672 1.68076,15.78366 0.27022,0.85389 1.16192,-5.66535 3.4533,-8.94247 5.30828,-7.59188 11.01216,-10.34106 22.3956,-10.79433 11.45664,-0.45619 17.24994,1.40719 22.67575,7.2935 2.19834,2.38491 4.81352,6.63522 5.81151,9.44514 0.99799,2.8099 1.71714,12.60892 2.03461,12.60892 0.31747,0 1.93246,-8.85 3.15236,-10.5 2.03364,-2.75065 2.71421,-3 8.18806,-3 10.04162,0 11.47006,3.01534 11.47006,24.21246 0,15.40285 -0.45512,16.19898 -9.29102,16.25248 -8.07484,0.0489 -10.70762,-1.86556 -12.29012,-8.93689 -0.68041,-3.04043 -0.17539,-10.17091 -0.62374,-10.17091 -0.44835,0 -2.90118,5.91418 -3.7047,7.46801 -2.27153,4.39266 -9.03584,9.94045 -13.78374,11.30483 -6.16671,1.77209 -19.48476,1.53944 -24.05629,-0.42025 -5.88553,-2.52296 -10.29054,-6.36679 -12.87128,-11.23154 -1.30691,-2.46354 -2.7709,-13.6333 -3.25331,-13.4725 -0.48242,0.16081 -1.65801,12.1019 -2.61242,15.18655 -2.3982,7.75101 -5.18005,11.25295 -11.32872,14.26122 -6.0832,2.97623 -17.70032,4.06248 -26.5639,2.48385 z m 75.12072,-26.45151 c 3.06346,-3.06347 3.92147,-6.82884 2.74513,-12.04707 -1.12165,-4.97561 -4.11553,-7.43873 -9.04163,-7.43873 -6.00902,0 -9.14068,3.31481 -9.71889,10.28725 -0.43343,5.22656 -0.25044,5.84225 2.57675,8.66944 4.01841,4.0184 9.72467,4.24307 13.43864,0.52911 z m 28.40107,-27.47025 c -8.64492,-2.72303 -10.01698,-12.37794 -2.41748,-17.01135 3.88788,-2.37044 10.67332,-2.62523 14.68374,-0.55136 5.8218,3.01058 6.42631,11.75627 1.08295,15.66758 -3.0181,2.20923 -9.45216,3.12264 -13.34921,1.89513 z"
        fill={color || "url(#yoigo-gradient)"}
      />
    </svg>
  );
};

// Logo Orange
export const OrangeLogo: React.FC<{ className?: string; bgColor?: string; textColor?: string }> = ({ className = "h-8 w-8", bgColor = "#FF7900", textColor = "text-white" }) => {
  return (
    <div className={`relative select-none ${className}`} style={{ backgroundColor: bgColor }}>
      <span 
        className={`absolute bottom-[2px] right-[4px] font-black lowercase tracking-tighter leading-none ${textColor}`} 
        style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '9px', letterSpacing: '-0.03em' }}
      >
        orange
      </span>
    </div>
  );
};

// Logo Vodafone
export const VodafoneLogo: React.FC<{ className?: string; color?: string; symbolColor?: string }> = ({ className = "h-8 w-8", color = "#E60000", symbolColor = "white" }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="12" fill={color} />
      <path d="M16.25 1.12C16.57 1.12 16.9 1.15 17.11 1.22C14.94 1.67 13.21 3.69 13.22 6C13.22 6.05 13.22 6.11 13.23 6.17C16.87 7.06 18.5 9.25 18.5 12.28C18.54 15.31 16.14 18.64 12.09 18.65C8.82 18.66 5.41 15.86 5.39 11.37C5.38 8.4 7 5.54 9.04 3.85C11.04 2.19 13.77 1.13 16.25 1.12Z" fill={symbolColor} />
    </svg>
  );
};

// Logo Lowi
export const LowiLogo: React.FC<{ className?: string; color?: string; symbolColor?: string }> = ({ className = "h-8", color = "#E50015", symbolColor = "white" }) => {
  return (
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="15" y="5" width="8" height="26" rx="4" fill={symbolColor} />
      <circle cx="37" cy="21" r="7" stroke={symbolColor} strokeWidth="6" />
      <path d="M51 14 L55 27 A 1.5 1.5 0 0 0 58 27 L61 19 L64 27 A 1.5 1.5 0 0 0 67 27 L71 14" stroke={symbolColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="81" y="13" width="8" height="18" rx="4" fill={symbolColor} />
      <circle cx="85" cy="7" r="4.5" fill={color === '#FFFFFF' ? '#E50015' : '#FFFFFF'} />
    </svg>
  );
};

// Logo Netflix
export const NetflixLogoSVG: React.FC<{ className?: string; color?: string }> = ({ className = "h-8", color = "#E50914" }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"
        fill={color}
      />
    </svg>
  );
};

// Logo Disney+
export const DisneyLogoSVG: React.FC<{ className?: string }> = ({ className = "h-6" }) => {
  return (
    <svg viewBox="0 0 1041 565" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="disney-radial-gradient" gradientUnits="userSpaceOnUse" cx="942.524" cy="279.896" r="760.124" fx="942.524" fy="279.896">
          <stop offset="0.007" stopColor="#021192" stopOpacity="1"/>
          <stop offset="0.03" stopColor="#021096" stopOpacity="1"/>
          <stop offset="0.057" stopColor="#010cb4" stopOpacity="1"/>
          <stop offset="0.084" stopColor="#0008ce" stopOpacity="1"/>
          <stop offset="0.111" stopColor="#0006d7" stopOpacity="1"/>
          <stop offset="0.138" stopColor="#0004e1" stopOpacity="1"/>
          <stop offset="0.165" stopColor="#0001fa" stopOpacity="1"/>
          <stop offset="0.191" stopColor="#0000fe" stopOpacity="1"/>
          <stop offset="0.216" stopColor="#0f1eff" stopOpacity="1"/>
          <stop offset="1" stopColor="#00ffff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Wave arc */}
      <path d="M955.3 273.9 C922.8 194 867.9 125.9 796.5 76.9 723.4 26.8 637.7 0.3 548.7 0.3 401.5 0.3 264.9 73.4 183.4 195.9 182.5 197.2 182.3 198.9 182.8 200.4 183.3 202 184.5 203.1 186 203.6 L197.4 207.5 C198.1 207.7 198.8 207.8 199.4 207.8 201.5 207.8 203.5 206.7 204.7 205 242.1 150 292.7 104.3 351.1 72.7 411.4 40.1 479.7 22.8 548.6 22.8 631.9 22.8 712.2 47.4 781 93.8 848.1 139.1 900.2 202.4 931.7 276.7 932.6 278.9 934.8 280.4 937.2 280.4 L950.8 280.4 C952.4 280.4 953.9 279.6 954.7 278.3 955.7 277 955.9 275.4 955.3 273.9 Z" fill="url(#disney-radial-gradient)" />
      {/* Disney wordmark */}
      <path d="M735.8 365.7 C721.4 369 683.5 370.9 683.5 370.9 L678.7 385.9 C678.7 385.9 697.6 384.3 711.4 385.7 711.4 385.7 715.9 385.2 716.4 390.8 716.6 396 716 401.6 716 401.6 716 401.6 715.7 405 710.9 405.8 705.7 406.7 670.1 408 670.1 408 L664.3 427.5 C664.3 427.5 662.2 432 667 430.7 671.5 429.5 708.8 422.5 713.7 423.5 718.9 424.8 724.7 431.7 723 438.1 721 445.9 683.8 469.7 661.1 468 661.1 468 649.2 468.8 639.1 452.7 629.7 437.4 642.7 408.3 642.7 408.3 642.7 408.3 636.8 394.7 641.1 390.2 641.1 390.2 643.7 387.9 651.1 387.3 L660.2 368.4 C660.2 368.4 649.8 369.1 643.6 361.5 637.8 354.2 637.4 350.9 641.8 348.9 646.5 346.6 689.8 338.7 719.6 339.7 719.6 339.7 730 338.7 738.9 356.7 738.8 356.7 743.2 364 735.8 365.7 Z M623.7 438.3 C619.9 447.3 609.8 456.9 597.3 450.9 584.9 444.9 565.2 404.6 565.2 404.6 565.2 404.6 557.7 389.6 556.3 389.9 556.3 389.9 554.7 387 553.7 403.4 552.7 419.8 553.9 451.7 547.4 456.7 541.2 461.7 533.7 459.7 529.8 453.8 526.3 448 524.8 434.2 526.7 410 526.7 410 C526.7 410 524.8 434.2 526.7 410 529 385.8 534.6 360 541.8 351.9 549 343.9 554.8 349.7 557 351.8 557 351.8 566.6 360.5 582.5 386.1 L585.3 390.8 C585.3 390.8 599.7 415 601.2 414.9 601.2 414.9 602.4 416 603.4 415.2 604.9 414.8 604.3 407 604.3 407 604.3 407 601.3 380.7 588.2 336.1 588.2 336.1 586.2 330.5 587.6 325.3 588.9 320 594.2 322.5 594.2 322.5 594.2 322.5 614.6 332.7 624.4 365.9 634.1 399.4 627.5 429.3 623.7 438.3 Z M523.5 353 C521.8 356.4 520.8 361.3 512.2 362.6 512.2 362.6 429.9 368.2 426 374 426 374 423.1 377.4 427.6 378.4 432.1 379.3 450.7 381.8 459.7 382.3 469.3 382.4 501.7 382.7 513.3 397.2 513.3 397.2 520.2 404.1 519.9 419.7 519.6 435.7 516.8 441.3 510.6 447.1 504.1 452.5 448.3 477.5 412.3 439.1 412.3 439.1 395.7 420.6 418 406.6 418 406.6 434.1 396.9 475 408.3 475 408.3 487.4 412.8 486.8 417.3 486.1 422.1 476.6 427.2 462.8 426.9 449.4 426.5 439.6 420.1 441.5 421.1 443.3 421.8 427.1 413.3 422.1 419.1 417.1 424.4 418.3 427.7 423.2 431 435.7 438.1 484 435.6 498.4 419.6 498.4 419.6 504.1 413.1 495.4 407.8 486.7 402.8 461.8 399.8 452.1 399.3 452.1 399.3 442.8 399.3 442.8 408.2 399.4 403.2 390.2 403.2 390.2 398.2 384 403.7 366.4 409.5 348 449.8 340.9 467.2 339.3 467.2 339.3 515.1 337.6 523.9 347.4 523.8 347.4 525 349.7 523.5 353 Z M387.5 460.9 C381.7 465.2 369.4 463.3 365.9 458.5 362.4 454.2 361.2 437.1 361.9 410.3 362.6 383.2 363.2 349.6 369 344.3 375.2 338.9 379 343.6 381.4 347.3 381.4 347.3 384 350.9 387.1 354.9 387.8 363.4 388.4 371.9 390.4 416.5 390.4 416.5 390.4 416.5 393 456.7 387.5 460.9 Z M400 317.1 C383.1 322.7 371.5 320.8 361.7 316.6 357.4 324.1 354.9 326.4 351.6 326.9 346.8 327.4 342.5 319.7 341.7 317.2 340.9 315.3 338.6 312.1 341.4 304.5 331.8 295.9 331.1 284.3 332.7 276.5 335.1 267.5 351.3 233.3 400.6 229.3 400.6 229.3 424.7 227.5 428.8 240.4 L429.5 240.4 C429.5 240.4 452.9 240.5 452.4 261.3 452.1 282.2 426.4 308.2 400 317.1 Z M354 270.8 C349 278.8 348.8 283.6 351.1 286.9 356.8 278.2 367.2 264.5 382.5 254.1 370.7 255.1 360.8 260.2 354 270.8 Z M422.1 257.4 C406.6 259.7 382.6 280.5 371.2 297.5 388.7 300.7 419.6 299.5 433.3 271.6 433.2 271.6 439.8 254.3 422.1 257.4 Z M842.9 418.5 C833.6 434.7 807.5 468.5 772.7 460.6 761.2 488.5 751.6 516.6 746.1 558.8 746.1 558.8 744.9 567 738.1 564.1 731.4 561.7 720.2 550.5 718 535 715.6 514.6 724.7 480.1 743.2 440.6 737.8 431.8 734.1 419.2 737.3 401.3 737.3 401.3 742 368.1 775.3 338.1 775.3 338.1 779.3 334.6 781.6 335.7 784.2 336.8 783 347.6 780.9 352.8 778.8 358 763.9 383.8 763.9 383.8 763.9 383.8 754.6 401.2 757.2 414.9 774.7 388 814.5 333.7 839.2 350.8 847.5 356.7 851.3 369.6 851.3 383.5 851.2 395.8 848.3 408.8 842.9 418.5 Z M835.7 375.9 C835.7 375.9 834.3 365.2 823.9 377 814.9 386.9 798.7 405.6 785.6 430.9 799.3 429.4 812.5 421.9 816.5 418.1 823 412.3 838.1 396.7 835.7 375.9 Z M350.2 389.5 C348.3 413.7 339 454.4 273.1 474.5 229.6 487.6 188.5 481.3 166.1 475.6 165.6 484.5 164.6 488.3 163.2 489.8 161.3 491.7 147.1 499.9 139.3 488.3 135.8 482.8 134 472.8 133 463.9 82.6 440.7 59.4 407.3 58.5 405.8 57.4 404.7 45.9 392.7 57.4 378 68.2 364.7 103.5 351.4 135.3 346 136.4 318.8 139.6 298.3 143.4 288.9 148 278 153.8 287.8 158.8 295.2 163 300.7 165.5 324.4 165.7 343.3 186.5 342.3 198.8 343.8 222 348 252.2 353.5 272.4 368.9 270.6 386.4 269.3 403.6 253.5 410.7 247.5 411.2 241.2 411.7 231.4 407.2 231.4 407.2 224.7 404 230.9 401.2 239 397.7 247.8 393.4 245.8 389 245.8 389 242.5 379.4 203.3 372.7 164.3 372.7 164.1 394.2 165.2 429.9 165.7 450.7 193 455.9 213.4 454.9 213.4 454.9 213.4 454.9 313 452.1 316 388.5 319.1 324.8 216.7 263.7 141 244.3 65.4 224.5 22.6 238.3 18.9 240.2 14.9 242.2 18.6 242.8 18.6 242.8 18.6 242.8 22.7 243.4 29.8 245.8 37.3 248.2 31.5 252.1 31.5 252.1 18.6 256.2 4.1 253.6 1.3 247.7 -1.5 241.8 3.2 236.5 8.6 228.9 14 220.9 19.9 221.2 19.9 221.2 113.4 188.8 227.3 247.4 227.3 247.4 334 301.5 352.2 364.9 350.2 389.5 Z M68 386.2 C57.4 391.4 64.7 398.9 64.7 398.9 84.6 420.3 109.1 433.7 132.4 442 135.1 405.1 134.7 392.1 135 373.5 98.6 376 77.6 381.8 68 386.2 Z" fill="#FFFFFF" />
      {/* Plus sign */}
      <path d="M1040.9 378.6 L1040.9 391.8 C1040.9 394.7 1038.6 397 1035.7 397 L972.8 397 C972.8 400.3 972.9 403.2 972.9 405.9 972.9 425.4 972.1 441.3 970.2 459.2 969.9 461.9 967.7 463.9 965.1 463.9 L951.5 463.9 C950.1 463.9 948.8 463.3 947.9 462.3 947 461.3 946.5 459.9 946.7 458.5 948.6 440.7 949.5 425 949.5 405.9 949.5 403.1 949.5 400.2 949.4 397 L887.2 397 C884.3 397 882 394.7 882 391.8 L882 378.6 C882 375.7 884.3 373.4 887.2 373.4 L948.5 373.4 C947.2 351.9 944.6 331.2 940.4 310.2 940.2 308.9 940.5 307.6 941.3 306.6 942.1 305.6 943.3 305 944.6 305 L959.3 305 C961.6 305 963.5 306.6 964 308.9 968.1 330.6 970.7 351.7 972 373.4 L1035.7 373.4 C1038.5 373.4 1040.9 375.8 1040.9 378.6 Z" fill="#00FFFF" />
    </svg>
  );
};

// Logo Max
export const MaxLogoSVG: React.FC<{ className?: string; color?: string }> = ({ className = "h-4", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 70 30" fill={color} xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* m */}
      <path d="M5 25V9.5h3.6v1.9c.7-1.3 2.1-2.2 4.2-2.2 2.2 0 3.7.9 4.3 2.5.9-1.6 2.5-2.5 4.8-2.5 3.3 0 4.9 2 4.9 5.3V25H23V17c0-2-.7-3-2.1-3s-2.1 1-2.1 3v8h-3.7V17c0-2-.7-3-2.1-3s-2.1 1-2.1 3v8H5z" />
      {/* a */}
      <path d="M42.5 25v-1.7c-.8 1.3-2.3 2.1-4.2 2.1-3.3 0-5.4-2-5.4-5.2 0-3.3 2.1-5.2 5.4-5.2 1.9 0 3.4.8 4.2 2.1V15c0-2-1-3-2.9-3-1.6 0-2.8.7-3.2 1.8h-3.6c.5-2.8 2.9-4.8 6.9-4.8 4 0 6.4 2 6.4 5.9V25h-3.8zm-4.1-3.2c1.7 0 2.9-.9 2.9-2.6v-.9c0-1.7-1.2-2.6-2.9-2.6-1.7 0-2.9.9-2.9 2.6v.9c0 1.7 1.2 2.6 2.9 2.6z" />
      {/* x */}
      <path d="M54.5 25l4.8-7.6 4.8 7.6h4.2l-6.9-10.4 6.6-9.6H64l-4.7 7.2-4.7-7.2h-4.2l6.6 9.6-6.9 10.4h4.4z" />
    </svg>
  );
};

// Logo Prime Video
export const PrimeVideoLogoSVG: React.FC<{ className?: string; color?: string }> = ({ className = "h-5", color = "#00A8E1" }) => {
  return (
    <svg viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* prime */}
      <path d="M5 23h3.5v-7.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V23h3.5v-8.5c0-3-1.8-5-4.8-5-2.2 0-3.5 1-4.2 2.3v-2H5V23z" fill="#FFFFFF" />
      <path d="M21 9.5h3.5V23H21V9.5z" fill="#FFFFFF" />
      <path d="M27 23h3.5v-7.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V23H39v-7.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V23h3.5v-8.5c0-3-1.8-5-4.8-5-2 0-3.2.8-3.8 2-.6-1.2-1.8-2-3.8-2-2 0-3.2.8-3.8 2.2v-2.2H27V23z" fill="#FFFFFF" />
      <path d="M47 16.2c0-4.2 2.8-7.2 6.8-7.2s6.8 3 6.8 7.2-2.8 7.2-6.8 7.2-6.8-3-6.8-7.2zm10 0c0-2-1.2-3.5-3.2-3.5s-3.2 1.5-3.2 3.5 1.2 3.5 3.2 3.5 3.2-1.5 3.2-3.5z" fill="#FFFFFF" />
      {/* video */}
      <path d="M64 9.5h3.8l3 8.5 3-8.5H77.6l-5 13.5h-3.6L64 9.5z" fill="#FFFFFF" />
      <path d="M80 9.5h3.5V23H80V9.5z" fill="#FFFFFF" />
      <path d="M86 16.2c0-4.2 2.8-7.2 6.8-7.2s6.8 3 6.8 7.2-2.8 7.2-6.8 7.2-6.8-3-6.8-7.2zm10 0c0-2-1.2-3.5-3.2-3.5s-3.2 1.5-3.2 3.5 1.2 3.5 3.2 3.5 3.2-1.5 3.2-3.5z" fill="#FFFFFF" />
      {/* Smile arrow */}
      <path d="M7 25c15 6 35 6 50 0 2-1 4 .5 2 2-15 7-35 7-50 0-2-1.5 0-3 2-2z" fill={color} />
      <path d="M57 25l3 4.5-5 .5 2-5z" fill={color} />
    </svg>
  );
};

// ================= PLANES VISUAL MOCKUPS (RENDERS 3D) =================

// 1. Mockup Plan: Router + 2 Smartphones (Fibra + Móvil)
export const RouterMobileComboVisual: React.FC<{ color: string }> = ({ color }) => {
  const { primary } = getOperatorColors(color);
  return (
    <div className="relative w-full h-[150px] bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-200/60">
      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: primary }} />
      <img 
        src="/images/plan_fiber_mobile.png" 
        alt="Fibra + Móviles" 
        className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105" 
      />
    </div>
  );
};

// 2. Mockup Plan: TV + Streaming (Televisión + Logos)
export const TvStreamingComboVisual: React.FC<{ color: string }> = ({ color }) => {
  const { primary } = getOperatorColors(color);
  return (
    <div className="relative w-full h-[150px] bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-200/60">
      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: primary }} />
      <img 
        src="/images/plan_tv_streaming.png" 
        alt="TV + Streaming" 
        className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105" 
      />
    </div>
  );
};

// 3. Mockup Plan: Router + TV (Fibra 1Gb / Gigabit)
export const RouterTvComboVisual: React.FC<{ color: string }> = ({ color }) => {
  const { primary } = getOperatorColors(color);
  return (
    <div className="relative w-full h-[150px] bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-200/60">
      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: primary }} />
      <img 
        src="/images/plan_gigabit.png" 
        alt="Fibra Gigabit" 
        className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105" 
      />
    </div>
  );
};

// ================= COMPONENTES MINIATURA ADICIONALES =================

// 4. Añadido: Línea móvil adicional
export const AddonSmartphoneVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
      <img src="/images/addon_phone.png" alt="Móvil" className="w-full h-full object-cover" />
    </div>
  );
};

// 5. Añadido: Mesh WiFi
export const AddonMeshVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
      <img src="/images/addon_mesh.png" alt="Mesh WiFi" className="w-full h-full object-cover" />
    </div>
  );
};

// 6. Añadido: TV Básica
export const AddonTvVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
      <img src="/images/addon_tv.png" alt="TV" className="w-full h-full object-cover" />
    </div>
  );
};

// 7. Añadido: Netflix
export const AddonNetflixVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-[#141414] border border-neutral-800 shadow-sm flex items-center justify-center p-2">
      <img src="/images/netflix.svg" alt="Netflix" className="w-full h-auto max-h-full object-contain" />
    </div>
  );
};

// 8. Añadido: Disney+
export const AddonDisneyVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-[#040e29] border border-blue-950 shadow-sm flex items-center justify-center p-2">
      <img src="/images/disney.svg" alt="Disney+" className="w-full h-auto max-h-full object-contain" />
    </div>
  );
};

// 8.b. Añadido: Max (HBO Max)
export const AddonMaxVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#002be7] to-[#001099] border border-blue-900 shadow-sm flex items-center justify-center p-2.5">
      <img src="/images/max.svg" alt="Max" className="w-full h-auto max-h-full object-contain" />
    </div>
  );
};

// 9. Añadido: Prime Video
export const AddonPrimeVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-[#0f172a] border border-slate-800 shadow-sm flex items-center justify-center p-2">
      <img src="/images/prime.svg" alt="Prime Video" className="w-full h-auto max-h-full object-contain" />
    </div>
  );
};

// 9.b. Añadido: Bundle Triple (Prime + Disney + Max)
export const AddonTripleBundleVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-[#070b19] border border-slate-900 shadow-sm flex flex-col justify-between py-1.5 px-1">
      <div className="h-[28%] w-full flex items-center justify-center">
        <img src="/images/prime.svg" alt="Prime" className="h-full w-auto object-contain" />
      </div>
      <div className="h-[28%] w-full flex items-center justify-center">
        <img src="/images/disney.svg" alt="Disney+" className="h-full w-auto object-contain" />
      </div>
      <div className="h-[28%] w-full flex items-center justify-center">
        <img src="/images/max.svg" alt="Max" className="h-[85%] w-auto object-contain" />
      </div>
    </div>
  );
};

// 10. Añadido: Dispositivo Financiado
export const AddonFinancingVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
      <img src="/images/addon_phone.png" alt="Dispositivo" className="w-full h-full object-cover" />
    </div>
  );
};

// 11. Añadido: Instalación
export const AddonSetupVisual: React.FC = () => {
  return (
    <div className="w-12 h-14 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
      <img src="/images/addon_setup.png" alt="Instalación" className="w-full h-full object-cover" />
    </div>
  );
};

// 12. Ilustración de Fibra Óptica (Líneas Curvas de Datos en el Hero)
export const FiberLinesVisual: React.FC<{ color: string }> = ({ color }) => {
  const { primary } = getOperatorColors(color);
  return (
    <div className="relative w-full h-full min-h-[140px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/20 via-purple-50/10 to-transparent" />
      <svg width="100%" height="100%" viewBox="0 0 300 150" fill="none" className="relative z-10 opacity-60">
        <path d="M -20 120 Q 80 50 150 100 T 320 30" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        <circle cx="150" cy="100" r="4" fill="#FFFFFF" stroke={primary} strokeWidth="2" className="animate-ping" style={{ animationDuration: '3s' }} />
        <circle cx="150" cy="100" r="4" fill={primary} />
        <path d="M -10 60 Q 100 110 180 40 T 310 120" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Patrón de Red Ligero de Fondo para la pantalla completa
export const TelecomVisual: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="light-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(15,23,42,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#light-grid)" />
        <circle cx="20%" cy="30%" r="500" fill="rgba(99,102,241,0.03)" filter="blur(90px)" />
        <circle cx="80%" cy="70%" r="600" fill="rgba(236,72,153,0.02)" filter="blur(100px)" />
      </svg>
    </div>
  );
};

// Logo WIN
export const WinLogo: React.FC<{ className?: string; color?: string }> = ({ className = "h-8", color = "#FFCC00" }) => {
  return (
    <svg viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M15 8 L22 25 L29 8 L36 25 L43 8" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="50" y="8" width="5.5" height="17" rx="2" fill={color} />
      <path d="M62 25 L62 13 L73 25 L73 8" stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Visual para fonoWIN Addon
export const AddonFonoWinVisual: React.FC = () => {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-500 flex items-center justify-center shadow-md shadow-yellow-500/10 shrink-0">
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 00.996.808H10a1 1 0 011 1v.077a1 1 0 01-.294.707l-1.72 1.72a15.004 15.004 0 006.071 6.071l1.72-1.72a1 1 0 01.707-.294h.077a1 1 0 011 1V19a2 2 0 01-2 2h-3.28a1 1 0 01-.94-.725l-.548-2.2a1 1 0 00-.996-.808H12a1 1 0 01-1-1v-.077a1 1 0 01.294-.707l1.72-1.72a15.004 15.004 0 00-6.071-6.071l-1.72 1.72a1 1 0 01-.707.294H3.77a1 1 0 01-1-1V5z" />
      </svg>
    </div>
  );
};

// Visual para WINBOX Addon
export const AddonWinboxVisual: React.FC = () => {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-950 flex flex-col items-center justify-center shadow-md relative border border-zinc-700/30 shrink-0">
      <div className="w-7 h-2 bg-zinc-700 rounded-sm mb-1 flex items-center justify-start px-0.5">
        <div className="w-1 h-1 rounded-full bg-[#FFCC00] animate-pulse" />
      </div>
      <span className="text-[7px] font-black text-[#FFCC00] tracking-wider">WINBOX</span>
    </div>
  );
};

// Visual para DGO Addon
export const AddonDgoVisual: React.FC = () => {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex flex-col items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
      <span className="text-[11px] font-black text-white tracking-tighter">DGO</span>
      <div className="w-4 h-0.5 bg-white rounded-full mt-0.5" />
    </div>
  );
};

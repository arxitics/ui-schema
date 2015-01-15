/**
 * Device Icons (contributed by Font Awesome 4.0.3)
 */

(function($) {
  'use strict';

  Schema.icons = $.extend(Schema.icons, {
    'desktop': [34, 32, 'M32 17.714v-14.857q0-0.232-0.17-0.402t-0.402-0.17h-28.571q-0.232 0-0.402 0.17t-0.17 0.402v14.857q0 0.232 0.17 0.402t0.402 0.17h28.571q0.232 0 0.402-0.17t0.17-0.402zM34.286 2.857v19.429q0 1.179-0.839 2.018t-2.018 0.839h-9.714q0 0.661 0.286 1.384t0.571 1.268 0.286 0.777q0 0.464-0.339 0.804t-0.804 0.339h-9.143q-0.464 0-0.804-0.339t-0.339-0.804q0-0.25 0.286-0.786t0.571-1.25 0.286-1.393h-9.714q-1.179 0-2.018-0.839t-0.839-2.018v-19.429q0-1.179 0.839-2.018t2.018-0.839h28.571q1.179 0 2.018 0.839t0.839 2.018z'],
    'laptop': [34, 32, 'M7.429 22.857q-1.179 0-2.018-0.839t-0.839-2.018v-12.571q0-1.179 0.839-2.018t2.018-0.839h19.429q1.179 0 2.018 0.839t0.839 2.018v12.571q0 1.179-0.839 2.018t-2.018 0.839h-19.429zM6.857 7.429v12.571q0 0.232 0.17 0.402t0.402 0.17h19.429q0.232 0 0.402-0.17t0.17-0.402v-12.571q0-0.232-0.17-0.402t-0.402-0.17h-19.429q-0.232 0-0.402 0.17t-0.17 0.402zM31.429 24h2.857v1.714q0 0.714-0.839 1.214t-2.018 0.5h-28.571q-1.179 0-2.018-0.5t-0.839-1.214v-1.714h31.429zM18.571 25.714q0.286 0 0.286-0.286t-0.286-0.286h-2.857q-0.286 0-0.286 0.286t0.286 0.286h2.857z'],
    'tablet': [21, 32, 'M11.429 25.143q0-0.464-0.339-0.804t-0.804-0.339-0.804 0.339-0.339 0.804 0.339 0.804 0.804 0.339 0.804-0.339 0.339-0.804zM18.286 22.286v-17.143q0-0.232-0.17-0.402t-0.402-0.17h-14.857q-0.232 0-0.402 0.17t-0.17 0.402v17.143q0 0.232 0.17 0.402t0.402 0.17h14.857q0.232 0 0.402-0.17t0.17-0.402zM20.571 5.143v19.429q0 1.179-0.839 2.018t-2.018 0.839h-14.857q-1.179 0-2.018-0.839t-0.839-2.018v-19.429q0-1.179 0.839-2.018t2.018-0.839h14.857q1.179 0 2.018 0.839t0.839 2.018z'],
    'mobile-phone': [14, 32, 'M8.286 25.143q0-0.589-0.42-1.009t-1.009-0.42-1.009 0.42-0.42 1.009 0.42 1.009 1.009 0.42 1.009-0.42 0.42-1.009zM12 22.286v-12.571q0-0.232-0.17-0.402t-0.402-0.17h-9.143q-0.232 0-0.402 0.17t-0.17 0.402v12.571q0 0.232 0.17 0.402t0.402 0.17h9.143q0.232 0 0.402-0.17t0.17-0.402zM8.571 7.143q0-0.286-0.286-0.286h-2.857q-0.286 0-0.286 0.286t0.286 0.286h2.857q0.286 0 0.286-0.286zM13.714 6.857v18.286q0 0.929-0.679 1.607t-1.607 0.679h-9.143q-0.929 0-1.607-0.679t-0.679-1.607v-18.286q0-0.929 0.679-1.607t1.607-0.679h9.143q0.929 0 1.607 0.679t0.679 1.607z'],
    'camera': [34, 32, 'M17.143 12q2.125 0 3.634 1.509t1.509 3.634-1.509 3.634-3.634 1.509-3.634-1.509-1.509-3.634 1.509-3.634 3.634-1.509zM29.714 4.571q1.893 0 3.232 1.339t1.339 3.232v16q0 1.893-1.339 3.232t-3.232 1.339h-25.143q-1.893 0-3.232-1.339t-1.339-3.232v-16q0-1.893 1.339-3.232t3.232-1.339h4l0.911-2.429q0.339-0.875 1.241-1.509t1.848-0.634h9.143q0.946 0 1.848 0.634t1.241 1.509l0.911 2.429h4zM17.143 25.143q3.304 0 5.652-2.348t2.348-5.652-2.348-5.652-5.652-2.348-5.652 2.348-2.348 5.652 2.348 5.652 5.652 2.348z'],
    'camera-retro': [32, 32, 'M16.571 14.857q0-0.25-0.161-0.411t-0.411-0.161q-1.179 0-2.018 0.839t-0.839 2.018q0 0.25 0.161 0.411t0.411 0.161 0.411-0.161 0.161-0.411q0-0.714 0.5-1.214t1.214-0.5q0.25 0 0.411-0.161t0.161-0.411zM20.571 17.179q0 1.893-1.339 3.232t-3.232 1.339-3.232-1.339-1.339-3.232 1.339-3.232 3.232-1.339 3.232 1.339 1.339 3.232zM2.286 27.429h27.429v-2.286h-27.429v2.286zM22.857 17.179q0-2.839-2.009-4.848t-4.848-2.009-4.848 2.009-2.009 4.848 2.009 4.848 4.848 2.009 4.848-2.009 2.009-4.848zM4.571 5.714h6.857v-2.286h-6.857v2.286zM2.286 9.143h27.429v-4.571h-14.786l-1.143 2.286h-11.5v2.286zM32 4.571v22.857q0 0.946-0.67 1.616t-1.616 0.67h-27.429q-0.946 0-1.616-0.67t-0.67-1.616v-22.857q0-0.946 0.67-1.616t1.616-0.67h27.429q0.946 0 1.616 0.67t0.67 1.616z'],
    'hdd-o': [32, 32, 'M18.571 21.714q0 0.589-0.42 1.009t-1.009 0.42-1.009-0.42-0.42-1.009 0.42-1.009 1.009-0.42 1.009 0.42 0.42 1.009zM23.143 21.714q0 0.589-0.42 1.009t-1.009 0.42-1.009-0.42-0.42-1.009 0.42-1.009 1.009-0.42 1.009 0.42 0.42 1.009zM25.143 24.571v-5.714q0-0.232-0.17-0.402t-0.402-0.17h-21.714q-0.232 0-0.402 0.17t-0.17 0.402v5.714q0 0.232 0.17 0.402t0.402 0.17h21.714q0.232 0 0.402-0.17t0.17-0.402zM3.179 16h21.071l-2.804-8.607q-0.071-0.232-0.286-0.384t-0.464-0.152h-13.964q-0.25 0-0.464 0.152t-0.286 0.384zM27.429 18.857v5.714q0 1.179-0.839 2.018t-2.018 0.839h-21.714q-1.179 0-2.018-0.839t-0.839-2.018v-5.714q0-0.446 0.286-1.339l3.518-10.821q0.304-0.946 1.125-1.536t1.804-0.589h13.964q0.982 0 1.804 0.589t1.125 1.536l3.518 10.821q0.286 0.893 0.286 1.339z'],
    'headphones': [30, 32, 'M29.714 15.821q0 2.964-1.071 5.607l-0.357 0.875-3.304 0.589q-0.393 1.482-1.616 2.438t-2.795 0.955v0.571q0 0.25-0.161 0.411t-0.411 0.161h-1.143q-0.25 0-0.411-0.161t-0.161-0.411v-10.286q0-0.25 0.161-0.411t0.411-0.161h1.143q0.25 0 0.411 0.161t0.161 0.411v0.571q1.268 0 2.321 0.634t1.661 1.705l1.214-0.214q0.518-1.696 0.518-3.446 0-2.643-1.571-4.982t-4.223-3.732-5.634-1.393-5.634 1.393-4.223 3.732-1.571 4.982q0 1.75 0.518 3.446l1.214 0.214q0.607-1.071 1.661-1.705t2.321-0.634v-0.571q0-0.25 0.161-0.411t0.411-0.161h1.143q0.25 0 0.411 0.161t0.161 0.411v10.286q0 0.25-0.161 0.411t-0.411 0.161h-1.143q-0.25 0-0.411-0.161t-0.161-0.411v-0.571q-1.571 0-2.795-0.955t-1.616-2.438l-3.304-0.589-0.357-0.875q-1.071-2.643-1.071-5.607 0-2.696 1.196-5.196t3.196-4.33 4.75-2.92 5.714-1.089 5.714 1.089 4.75 2.92 3.196 4.33 1.196 5.196z'],
    'keyboard-o': [34, 32, 'M6.857 20.857v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM9.143 16.286v1.714q0 0.286-0.286 0.286h-4q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h4q0.286 0 0.286 0.286zM6.857 11.714v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM25.143 20.857v1.714q0 0.286-0.286 0.286h-15.429q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h15.429q0.286 0 0.286 0.286zM13.714 16.286v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM11.429 11.714v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM18.286 16.286v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM16 11.714v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM22.857 16.286v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM29.714 20.857v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM20.571 11.714v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM25.143 11.714v1.714q0 0.286-0.286 0.286h-1.714q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM29.714 11.714v6.286q0 0.286-0.286 0.286h-4q-0.286 0-0.286-0.286v-1.714q0-0.286 0.286-0.286h2v-4.286q0-0.286 0.286-0.286h1.714q0.286 0 0.286 0.286zM32 25.143v-16h-29.714v16h29.714zM34.286 9.143v16q0 0.946-0.67 1.616t-1.616 0.67h-29.714q-0.946 0-1.616-0.67t-0.67-1.616v-16q0-0.946 0.67-1.616t1.616-0.67h29.714q0.946 0 1.616 0.67t0.67 1.616z'],
    'microphone': [21, 32, 'M20.571 12.571v2.286q0 3.946-2.634 6.866t-6.509 3.348v2.357h4.571q0.464 0 0.804 0.339t0.339 0.804-0.339 0.804-0.804 0.339h-11.429q-0.464 0-0.804-0.339t-0.339-0.804 0.339-0.804 0.804-0.339h4.571v-2.357q-3.875-0.429-6.509-3.348t-2.634-6.866v-2.286q0-0.464 0.339-0.804t0.804-0.339 0.804 0.339 0.339 0.804v2.286q0 3.304 2.348 5.652t5.652 2.348 5.652-2.348 2.348-5.652v-2.286q0-0.464 0.339-0.804t0.804-0.339 0.804 0.339 0.339 0.804zM16 5.714v9.143q0 2.357-1.679 4.036t-4.036 1.679-4.036-1.679-1.679-4.036v-9.143q0-2.357 1.679-4.036t4.036-1.679 4.036 1.679 1.679 4.036z'],
    'microphone-slash': [25, 32, 'M4.839 16.875l-1.804 1.804q-0.75-1.839-0.75-3.821v-2.286q0-0.464 0.339-0.804t0.804-0.339 0.804 0.339 0.339 0.804v2.286q0 0.946 0.268 2.018zM24.732 6.125l-6.446 6.446v2.286q0 2.357-1.679 4.036t-4.036 1.679q-0.982 0-1.946-0.339l-1.714 1.714q1.732 0.911 3.661 0.911 3.304 0 5.652-2.348t2.348-5.652v-2.286q0-0.464 0.339-0.804t0.804-0.339 0.804 0.339 0.339 0.804v2.286q0 3.946-2.634 6.866t-6.509 3.348v2.357h4.571q0.464 0 0.804 0.339t0.339 0.804-0.339 0.804-0.804 0.339h-11.429q-0.464 0-0.804-0.339t-0.339-0.804 0.339-0.804 0.804-0.339h4.571v-2.357q-2.232-0.232-4.196-1.446l-4.536 4.536q-0.179 0.179-0.411 0.179t-0.411-0.179l-1.464-1.464q-0.179-0.179-0.179-0.411t0.179-0.411l22.036-22.036q0.179-0.179 0.411-0.179t0.411 0.179l1.464 1.464q0.179 0.179 0.179 0.411t-0.179 0.411zM17.946 3.768l-11.089 11.089v-9.143q0-2.357 1.679-4.036t4.036-1.679q1.821 0 3.295 1.054t2.080 2.714z']
  });

})(jQuery);


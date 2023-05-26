# bolobao (Pineapple Bun)

The bolobao (another Angular frontend project). Previously [file-service-front](https://github.com/CurtisNewbie/file-service-front) and [auth-service-front](https://github.com/CurtisNewbie/auth-service-front).

This project attempts to merge the following two frontend projects together, making it easier (for me) to develop and maintain :D

- [file-service-front](https://github.com/CurtisNewbie/file-service-front)
- [auth-service-front](https://github.com/CurtisNewbie/auth-service-front).

This git history of these two projects are being replayed in this repository using git patch.

## Dependencies & Compatibility

**Compatible with:**

- [vfm >= v0.0.1](https://github.com/CurtisNewbie/vfm/tree/v0.0.1)
- [mini-fstore >= v0.0.1](https://github.com/CurtisNewbie/mini-fstore/tree/v0.0.1)
- [auth-service >= v1.1.6](https://github.com/CurtisNewbie/auth-service/tree/v1.1.6)
- [fantahsea >= v1.0.3.5](https://github.com/CurtisNewbie/fantahsea/tree/v1.0.3.5)
- [dtask-go >= v1.0.0](https://github.com/CurtisNewbie/dtask-go/tree/v1.0)
- [goauth >= v1.0.0](https://github.com/CurtisNewbie/goauth/tree/v1.0.0)
- [auth-gateway >= v1.1.1](https://github.com/CurtisNewbie/auth-gateway/tree/v1.1.1) (no direct dependency, but of course you will need it)

## Known Issue (fixed tho)

ngx-lightbox2 is used in this project. When image rotate, the background may be out-of-sync with the image's rotation, as a result, we can see the white background behind the image. After some investigation, I personally think that this may be caused by the attribute `text-align: center` in class `.lightbox` in `node_modules/ngx-lightbox/lightbox.css` (there may be some conflicts, I am not sure). Removing it somehow fixed the issue :D, so this attribute is overriden in `gallery-image.component.css`.

```css
.lightbox {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 10000;
  text-align: center;
  line-height: 0;
  font-weight: normal;
  box-sizing: content-box;
  outline: none;
}
```

## Updates

- Since v0.0.1, [file-server v1.2.7](https://github.com/CurtisNewbie/file-server/tree/v1.2.7) has been replaced with [vfm](https://github.com/curtisnewbie/vfm) and [mini-fstore](https://github.com/curtisnewbie/mini-fstore).

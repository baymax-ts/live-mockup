import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as PIXI from 'pixi.js';
import { Transformer } from "@pixi-essentials/transformer";

const MockupCanvas = forwardRef(({model}, ref) => {
  const pixiContainerRef = useRef(null);
  const appRef = useRef(null);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const transformRef = useRef(null);
  const drawRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toggleVisible,
    addLogo,
    removeLogo,
    changeLogo,
    setColor,
    deselect,
    getDownloadLink
  }));

  const getDownloadLink = async () => {
    const image = await appRef.current.renderer.plugins.extract.image(appRef.current.stage, 'image/png', 1.0);
    return image.src;
  }

  const deselect = () => {
    transformRef.current.group = [];
  }

  const toggleVisible = (index) => {
    logoRef.current.getChildAt(index + 1).visible = !logoRef.current.getChildAt(index + 1).visible;
  }

  const addLogo = (data, first) => {
    if (first && logoRef.current.children.length >= 2) {
      logoRef.current.getChildAt(1).removeFromParent();
    }

    const url = URL.createObjectURL(data);
    const sprite = PIXI.Sprite.from(url);
    sprite.anchor.set(0.5);
    sprite.x = appRef.current.screen.width / 2;
    sprite.y = appRef.current.screen.height / 2;
    // sprite.filters = [displacementFilter];
    logoRef.current.addChild(sprite);
    sprite.interactive='static';
    sprite.on('pointertap', (event) => {  
      event.stopPropagation();
      transformRef.current.group = [sprite];
    })
  }

  const removeLogo = (index) => {
    logoRef.current.getChildAt(index + 1).removeFromParent();
  }

  const changeLogo = (index, data) => {
    logoRef.current.getChildAt(index + 1).texture = PIXI.Texture.from(URL.createObjectURL(data));
  }

  const setColor = (color) => {
    drawRef.current.getChildAt(0).tint = color;
  }

  useEffect(() => {    
    const app = new PIXI.Application({ width: 1000, height: 1000, background: "#FFFFFF" });
    pixiContainerRef.current.appendChild(app.view);
    app.view.className="w-full rounded-lg shadow-lg"
    appRef.current = app;

    app.stage.interactive='static';

    const circle = new PIXI.Graphics();
    app.stage.addChild(circle);
    app.stage.addChild(new PIXI.Sprite());  //Base Image
    const mask = app.stage.addChild(new PIXI.Sprite());  //Mask Image
    const container = app.stage.addChild(new PIXI.Container());
    containerRef.current = container;

    container.mask = mask;
    container.addChild(new PIXI.Sprite());
    const drawPan = container.addChild(new PIXI.Container());

    const tintObject = new PIXI.Graphics();
    tintObject.beginFill(0xFFFFFF);
    tintObject.drawRect(0, 0, 1000, 1000);
    tintObject.endFill();

    drawPan.addChild(tintObject);
    drawRef.current = drawPan;

    const logoContainer = drawPan.addChild(new PIXI.Container());

    const emptyObject = new PIXI.Graphics();
    emptyObject.beginFill("#00FFFFFF");
    emptyObject.drawRect(0, 0, 1000, 1000);
    emptyObject.endFill();
    emptyObject.alpha = 0;
    logoContainer.addChild(emptyObject);

    const sampleLogo = logoContainer.addChild(PIXI.Sprite.from("sample.png"));
    sampleLogo.anchor.set(0.5);
    sampleLogo.x = appRef.current.screen.width / 2;
    sampleLogo.y = appRef.current.screen.height / 2 + 100;
    // sampleLogo.filters = [displacementFilter];
    sampleLogo.interactive='static';
    sampleLogo.scale.set(0.8, 0.8);
    sampleLogo.on('pointertap', (event) => {  
      event.stopPropagation();
      transformRef.current.group = [sampleLogo];
    })

    logoRef.current = logoContainer;
    const blurFilter = new PIXI.AlphaFilter();
    blurFilter.blendMode = PIXI.BLEND_MODES.MULTIPLY;

    drawPan.filters = [blurFilter];

    circle.beginFill(0xfedbac).drawCircle(0, 0, 0).endFill();
    circle.pivot.set(50, 100);
    circle.scale.set(1);
    circle.position.set(300, 300);

    const transformer = app.stage.addChild(new Transformer({
      rotateEnabled: true,
      lockAspectRatio: true,
      skewEnabled: true,
      stage: app.stage,
      wireframeStyle: {
        thickness: 1,
        color: 0xff0000
      }
    }));
    transformRef.current = transformer;

    app.stage.addEventListener('click', () => {
      transformer.group = [];
    })

    // Clean up the Pixi.js application on component unmount
    return () => {
      app.destroy(true);
    };
  }, []);

  useEffect(() => {
    if (!model) return;
    appRef.current.stage.getChildAt(1).texture = PIXI.Texture.from(model.base_image);
    appRef.current.stage.getChildAt(2).texture = PIXI.Texture.from(model.mask_image);
    containerRef.current.getChildAt(0).texture = PIXI.Texture.from(model.base_image);

    const displacementSprite = PIXI.Sprite.from(model.base_image);
    displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    const displacementFilter = new PIXI.DisplacementFilter(displacementSprite);
    
    logoRef.current.filters = [displacementFilter];
  }, [model]);

  return <div ref={pixiContainerRef} className="w-full"/>
});

export default MockupCanvas
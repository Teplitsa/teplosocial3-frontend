import {
  useState,
  useEffect,
  useRef,
  Children,
  cloneElement,
  MouseEvent,
  ReactElement,
  ReactChild,
  ReactPortal,
} from "react";
import Button from "../form/button/Button";
import {
  convertObjectToClassName,
  convertClassNameToObject,
} from "../../utilities/utilities";
import { ICarouselProps } from "../inclusive-components.typing";
import useIsomorphicLayoutEffect from "../../custom-hooks/use-isomorphic-layout-effect";
import styles from "./Carousel.module.scss";

const Carousel: React.FunctionComponent<ICarouselProps> = ({
  children,
  topContent: TopContent = null,
  autoplay = true,
  pauseOnHover = true,
  animation = {
    time: 600,
    pauseTime: 3000,
  },
  itemWidth = 280,
  classNameObject,
  nav = true,
  controls = true,
}): ReactElement => {
  let itemList: boolean | {} | ReactChild | ReactPortal = null;
  let itemCount = 0;
  const carouselRef = useRef<HTMLDivElement>(null);
  const [calculatedItemWidth, setCalculatedItemWidth] =
    useState<number>(itemWidth);
  const [visibleItemCount, setVisibleItemCount] = useState<number>(1);
  const [isComponentInit, setIsComponentInit] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);

  const handleNavItemClick = (event: MouseEvent<HTMLButtonElement>) => {
    setActiveIndex(Number(event.currentTarget.dataset.index));
  };

  const handleItemMouseEnter = () => {
    setPause(true);
  };

  const handleItemMouseLeave = () => {
    setPause(false);
  };

  const handleCarouselFocus = (event: Event) => {
    if (
      carouselRef.current === event.target ||
      carouselRef.current?.contains(event.target as HTMLElement)
    ) {
      setFocus(true);
    } else {
      setFocus(false);
    }
  };

  const handleCarouselBlur = (event: Event) => {
    if (carouselRef.current?.contains(event.target as HTMLElement)) {
      setFocus(false);
    }
  };

  const handlePreviousClick = (event: MouseEvent<HTMLButtonElement>) => {
    setActiveIndex((previousIndex) =>
      previousIndex === 0 ? 0 : previousIndex - 1
    );
  };

  const handleNextClick = (event: MouseEvent<HTMLButtonElement>) => {
    setActiveIndex((previousIndex) =>
      previousIndex === itemCount - 1 ? 0 : previousIndex + 1
    );
  };

  useEffect(() => {
    if (
      !autoplay ||
      (pauseOnHover && pause) ||
      focus ||
      itemCount <= visibleItemCount
    )
      return;

    const play = () => {
      setActiveIndex((previousIndex) => {
        return itemCount - previousIndex <= visibleItemCount
          ? 0
          : previousIndex + 1;
      });
    };

    const timerId = setTimeout(play, animation.time + animation.pauseTime);

    return () => clearTimeout(timerId);
  }, [activeIndex, pause, focus, visibleItemCount]);

  useIsomorphicLayoutEffect(() => {
    if (itemWidth >= carouselRef.current?.offsetWidth) {
      setCalculatedItemWidth(carouselRef.current?.offsetWidth);
      setVisibleItemCount(1);
    } else {
      const visibleItemCount = Math.floor(
        (carouselRef.current?.offsetWidth + 26) / (itemWidth + 26)
      );

      const visibleItemWidth =
        itemWidth +
        ((carouselRef.current?.offsetWidth + 26) % (itemWidth + 26)) /
          visibleItemCount;

      setCalculatedItemWidth(visibleItemWidth);
      setVisibleItemCount(visibleItemCount);
    }
  }, [carouselRef.current?.offsetWidth]);

  useEffect(() => {
    document.addEventListener("focus", handleCarouselFocus, true);
    document.addEventListener("blur", handleCarouselBlur, true);

    setIsComponentInit(true);

    return () => {
      document.removeEventListener("focus", handleCarouselFocus);
      document.removeEventListener("blur", handleCarouselBlur);
    };
  }, []);

  try {
    itemList = Children.only(children);
  } catch (error) {
    console.error("The carousel must have only one root element.");

    return null;
  }

  itemCount = Children.count((itemList as ReactElement).props.children);

  if (itemCount === 0) {
    console.error("The carousel has no items.");

    return null;
  }

  return (
    <div
      ref={carouselRef}
      className={styles["carousel"]}
      role="region"
      aria-roledescription="carousel"
      aria-label="Слайдшоу"
      onMouseEnter={handleItemMouseEnter}
      onMouseLeave={handleItemMouseLeave}
    >
      {(TopContent || controls) && (
        <div className={styles["carousel__top"]}>
          {TopContent && (
            <div className={styles["carousel__top-content"]}>
              <TopContent />
            </div>
          )}
          {controls && itemCount > visibleItemCount && (
            <div
              className={convertObjectToClassName({
                [styles["carousel__controls"]]: true,
                ...(classNameObject?.controls ?? {}),
              })}
            >
              <Button
                className={convertObjectToClassName({
                  ["btn_reset"]: true,
                  [styles["carousel__previous"]]: true,
                })}
                aria-controls={
                  (itemList as ReactElement).props.id ??
                  styles["carousel__item-list"]
                }
                aria-label="Предыдущий слайд"
                onClick={handlePreviousClick}
              />
              <Button
                className={convertObjectToClassName({
                  ["btn_reset"]: true,
                  [styles["carousel__next"]]: true,
                })}
                aria-controls={
                  (itemList as ReactElement).props.id ??
                  styles["carousel__item-list"]
                }
                aria-label="Следующий слайд"
                onClick={handleNextClick}
              />
            </div>
          )}
        </div>
      )}
      {nav && (
        <div
          className={convertObjectToClassName({
            [styles["carousel__nav"]]: true,
            [styles["carousel__nav_invisible"]]: itemCount <= visibleItemCount,
            ...(classNameObject?.nav ?? {}),
          })}
        >
          {Children.toArray((itemList as ReactElement).props.children).map(
            (_, i) => {
              return (
                <Button
                  key={`CarouselNavItem-${i}`}
                  className={convertObjectToClassName({
                    ["btn_reset"]: true,
                    [styles["carousel__nav-item"]]: true,
                    [styles["carousel__nav-item_active"]]: activeIndex === i,
                  })}
                  data-index={i}
                  aria-controls={
                    (itemList as ReactElement).props.id ??
                    styles["carousel__item-list"]
                  }
                  aria-label={`Слайд ${i + 1} из ${itemCount}`}
                  onClick={handleNavItemClick}
                />
              );
            }
          )}
        </div>
      )}
      <div
        className={convertObjectToClassName({
          [styles["carousel__viewport"]]: true,
          ...(classNameObject?.viewport ?? {}),
        })}
      >
        {cloneElement(itemList as ReactElement, {
          ...(itemList as ReactElement).props,
          style: {
            ...(itemList as ReactElement).props.style,
            gridTemplateColumns: `repeat(auto-fill, ${calculatedItemWidth}px)`,
          },
          id:
            (itemList as ReactElement).props.id ??
            styles["carousel__item-list"],
          className: convertObjectToClassName({
            ...convertClassNameToObject(
              (itemList as ReactElement).props.className
            ),
            [styles["carousel__item-list"]]: true,
          }),
          "aria-live": (pauseOnHover && pause) || focus ? "polite" : "off",
          children: Children.toArray(
            (itemList as ReactElement).props.children
          ).map((item: ReactElement, i) =>
            cloneElement(item, {
              ...item.props,
              key: `CarouselItem-${i}`,
              style: {
                ...item.props.style,
                width: `${calculatedItemWidth}px`,
                transform: `translateX(calc(-${activeIndex * 100}% - ${
                  activeIndex * 26
                }px))`,
              },
              className: convertObjectToClassName({
                ...convertClassNameToObject(item.props.className),
                [styles["carousel__item"]]: true,
                [styles["carousel__item_active"]]:
                  isComponentInit && activeIndex === i,
              }),
              role: "group",
              "aria-roledescription": "slide",
              "aria-label": `${i + 1} из ${itemCount}`,
              tabIndex: activeIndex === i ? 0 : null,
            })
          ),
        })}
      </div>
    </div>
  );
};

export default Carousel;

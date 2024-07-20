import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Image,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useLoadData } from "~/data/hooks/useLoadData";
import WelcomeBannerPic from "~/res/images/WelcomeBanner.png";
import { differenceInDays } from "~/utilities/differenceInDays";

export const WelcomeBanner = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const { isLoading, isError } = useCheckUserVisits(onOpen);

  if (isLoading || isError) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      size="xs"
    >
      <ModalContent>
        {(onClose) => {
          return (
            <>
              <ModalHeader className="bg-success-to-danger justify-center">
                <p className="text-xl font-semibold text-danger">!! Win !!</p>
              </ModalHeader>
              <ModalBody className="items-center p-4 text-center">
                <Image alt="welcome" src={WelcomeBannerPic.src} removeWrapper />
              </ModalBody>
              <ModalFooter className="bg-success-to-danger flex w-full flex-col justify-end gap-2 text-center font-bold">
                <p className="text-xl text-danger">
                  Play &gt; Win Coins &gt; Redeem Rewards!
                </p>
                <p className="text-xs text-danger-400">
                  Get 100 coins on sign up.
                </p>
                <Button
                  fullWidth
                  color="danger"
                  variant="solid"
                  onPress={onClose}
                  className="font-bold text-white"
                >
                  Continue to app
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

const useCheckUserVisits = (onDailyVisit: () => void, limit = 3) => {
  const onLoadSuccess = (userVisitsStringified: string | null) => {
    if (!userVisitsStringified) {
      onDailyVisit();
      localStorage.setItem(
        "userVisits",
        JSON.stringify([new Date().toUTCString()]),
      );
      return;
    }

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const userVisits: Array<string> = JSON.parse(userVisitsStringified);
    const visitsCount = userVisits.length;
    if (visitsCount >= limit) {
      return;
    }

    const lastVisitedDate = new Date(userVisits[visitsCount - 1]!);
    const today = new Date();
    const daysSinceLastVisit = differenceInDays(lastVisitedDate, today);

    if (daysSinceLastVisit >= 1) {
      onDailyVisit();
      localStorage.setItem(
        "userVisits",
        JSON.stringify([...userVisits, today.toUTCString()]),
      );
    }
  };

  return useLoadData(
    "userVisits",
    () => Promise.resolve(localStorage.getItem("userVisits")),
    onLoadSuccess,
  );
};

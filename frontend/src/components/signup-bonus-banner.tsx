import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  Image,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect } from "react";
import { useMainStore } from "~/data/contexts/store-context";
import { CoinType } from "~/schema/CoinType";
import { pick } from "~/utilities/pick";
import CoinsAward from "../res/images/CoinsAward.png";

export const SignupBonusBanner = () => {
  const { isNewUser, setUser, bonusCoins } = useMainStore((state) => ({
    bonusCoins:
      state.userCoins.find(
        (coinCategory) => coinCategory.type === CoinType.Bonus,
      )?.coins ?? 0,
    ...pick(state, ["isNewUser", "setUser"]),
  }));
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  useEffect(() => {
    if (isNewUser && bonusCoins) {
      onOpen();
      setUser({ isNewUser: false });
    }
  }, [isNewUser, bonusCoins]);

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
              <ModalHeader className="justify-center bg-success-100">
                <p className="text-xl font-bold text-success">Signup Bonus</p>
              </ModalHeader>
              <ModalBody className="items-center p-4 text-center">
                <Image alt="Coins" src={CoinsAward.src} removeWrapper />
              </ModalBody>
              <ModalFooter className="flex w-full flex-col justify-end gap-2 bg-success-100 text-center font-bold">
                <p className="text-xl text-success">
                  You are awarded {bonusCoins} coins!
                </p>
                <p className="text-xs text-success-700">
                  Use these coins to participate in Opinions and more.
                </p>
                <Button
                  fullWidth
                  color="success"
                  variant="solid"
                  onPress={onClose}
                  className="font-bold text-white"
                >
                  Continue
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

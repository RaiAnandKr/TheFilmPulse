import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  cn,
  Image,
  Divider,
  type useDisclosure,
} from "@nextui-org/react";
import type { CouponDetail } from "~/schema/CouponDetail";
import { useState } from "react";
import { getCouponCode } from "~/service/apiUtils";
import { CoinsImage } from "~/res/images/CoinsImage";
import { useMainStore } from "~/data/contexts/store-context";
import { pick } from "~/utilities/pick";
import { CouponMode } from "~/schema/CouponMode";
import { UI_TIMEOUT_IN_MILLIS } from "~/constants/ui-configs";

type CouponDisclosureProps = ReturnType<typeof useDisclosure> &
  CouponDetail & { mode: CouponMode };

export const CouponDisclosure = (props: CouponDisclosureProps) => {
  const {
    isOpen,
    onOpenChange,
    couponLogoSrc,
    couponBrandName,
    couponInfo,
    couponId,
    worthCoins,
    mode,
  } = props;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="h-3/4">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 pb-0">
              <div className="flex items-center gap-4">
                <Image
                  alt="Coupon Logo"
                  height={32}
                  width={32}
                  src={couponLogoSrc}
                />
                <h3>{couponBrandName}</h3>
              </div>
              <p className="text-tiny text-default-500">{couponInfo}</p>
              {mode === CouponMode.New && (
                <div className="flex justify-between text-sm text-danger">
                  <span>Coins to be decucted on claim: </span>
                  <span className="flex gap-1">
                    {worthCoins} <CoinsImage />
                  </span>
                </div>
              )}
              <Divider />
            </ModalHeader>
            <ModalBody className="min-h-[25%] overflow-y-auto">
              <CouponTnC {...props} />
            </ModalBody>
            <ModalFooter className="flex flex-col items-center justify-center pt-0">
              <Divider />
              {mode === CouponMode.Claimed ? (
                <ClaimedCodes couponId={couponId} />
              ) : (
                <ClaimNewCode
                  couponId={couponId}
                  worthCoins={worthCoins}
                  onClose={onClose}
                />
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const CouponTnC: React.FC<
  Pick<CouponDetail, "worthCoins" | "couponExpiryDate" | "couponTnCs">
> = (props) => {
  return (
    <>
      <h3 className=" font-bold">Terms & Conditions</h3>
      <ul className="list-inside list-disc space-y-4 text-sm">
        {props.couponTnCs?.map((tnC, idx) => <li key={idx}> {tnC} </li>)}
        <li> Expiry date of this coupon code is {props.couponExpiryDate}.</li>
        <li>
          The Coupon code will be revealed on clicking the &quot;Claim&quot;
          button.
        </li>
        <li>
          {props.worthCoins} coins will be deducted from your balance on
          clicking the &quot;Claim&quot; button.
        </li>
        <li>
          Once revealed, you will not be shown the code again on page refresh or
          closing this dialog. So, make sure to copy the coupon code.
        </li>
        <li>The coupon code is applicable for only one transaction.</li>
      </ul>
    </>
  );
};

const ClaimedCodes: React.FC<Pick<CouponDetail, "couponId">> = (props) => {
  const claimedCoupons = useMainStore((state) => state.claimedCoupons);

  return claimedCoupons
    .get(props.couponId)
    ?.map((claimedCode) => (
      <CouponCode couponCode={claimedCode.code} key={claimedCode.code} />
    ));
};

const ClaimNewCode: React.FC<
  Pick<CouponDetail, "couponId" | "worthCoins"> & { onClose: () => void }
> = (props) => {
  const { couponId, worthCoins, onClose } = props;
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);

  const { updateUserCoins, updateClaimedCoupon } = useMainStore((state) =>
    pick(state, ["updateUserCoins", "updateClaimedCoupon"]),
  );

  const onClaim = async () => {
    const couponCode = await getCouponCode(couponId).catch(console.log);
    if (couponCode) {
      setCouponCode(couponCode.code);
      updateUserCoins(worthCoins /* deductBy */, true);
      updateClaimedCoupon(couponId, couponCode);
    } else {
      // TODO: Handle this in a much better way for users sake.
      console.log("No coupon code found.");
    }
  };

  return (
    <>
      <CouponCode couponCode={couponCode} />
      <div className="flex w-full justify-end gap-2">
        <Button
          color="danger"
          variant="bordered"
          onPress={onClose}
          className="font-bold"
        >
          Close
        </Button>
        <Button
          color="primary"
          onPress={onClaim}
          className="font-bold text-white"
          isDisabled={!!couponCode}
        >
          Claim
        </Button>
      </div>
    </>
  );
};

const CouponCode: React.FC<{
  couponCode?: string;
}> = (props) => {
  const { couponCode } = props;

  const couponCodeSecretClass = couponCode ? "" : "opacity-disabled";

  const [couponActionLabel, setCouponActionLabel] = useState("Copy");

  const onCopy = async () => {
    if (!couponCode) {
      return;
    }
    await navigator.clipboard.writeText(couponCode);
    setCouponActionLabel("Copied");
    setTimeout(() => setCouponActionLabel("Copy"), UI_TIMEOUT_IN_MILLIS);
  };

  return (
    <div className="flex w-full items-center justify-between text-sm">
      <span className="font-bold">CODE</span>
      <div className="flex items-center">
        <span
          className={cn(
            "rounded-l-lg border-2 border-r-0 border-dashed border-success p-2 font-bold text-default-500",
            couponCodeSecretClass,
          )}
        >
          {couponCode ?? <MaskedCode />}
        </span>
        <Button
          variant="solid"
          color="success"
          className="h-10 rounded-r-lg font-bold text-white"
          radius="none"
          isDisabled={!couponCode}
          onPress={onCopy}
        >
          {couponActionLabel}
        </Button>
      </div>
    </div>
  );
};

const MaskedCode = () => (
  <>&#9679; &nbsp; &#9679; &nbsp; &#9679; &nbsp; &#9679; &nbsp; &#9679;</>
);

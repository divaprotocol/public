import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, AlertIcon, Stack } from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
import { isAddress, parseUnits } from 'ethers/lib/utils'
import { useToast } from '@chakra-ui/react'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import {
  useAccount,
  useNetwork,
  useWalletClient,
  useContractWrite,
  useContractReads,
} from "wagmi";
import { getContract } from "wagmi/actions";
import 'react-loading-skeleton/dist/skeleton.css'

import ClaimDivaLinearVestingABI from '../abi/ClaimDivaLinearVestingABI.json'
import { config, DIVA_TOKEN_DECIMALS, ZERO_BIGNUMBER } from '../constants'
import { addThousandSeparators, toStringFixed } from '../util/bn'

/**
 * TODO: load rewards via ajax
 */
import PageLayout from '../components/pageLayout/PageLayout'
import { Heading } from '../components/typography/Heading'
import { Paragraph } from '../components/typography/Paragraph'
import { Highlight } from '../components/typography/Highlight'
import RewardPageBlobs from '../components/RewardPageBlobs'
import TokenClaimInfo from '../components/TokenClaimInfo'
import { TbX } from 'react-icons/tb'

const Rewards = () => {
	const { address: userAddress } = useAccount()
	const { chain } = useNetwork()
	const { data: signer } = useWalletClient()
	const [rewardInfo, setRewardInfo] = useState<any>({})
	const [proof, setProof] = useState<string[]>([])
	const [isClaiming, setIsClaiming] = useState<boolean>(false)
	const [trigger, setTrigger] = useState<boolean>(false)
	const [claimedAmount, setClaimedAmount] = useState<BigNumber>(
		BigNumber.from(-1)
	)
	const [availableDrawDownAmount, setAvailableDrawDownAmount] =
		useState<BigNumber>(ZERO_BIGNUMBER)
	const [claimPeriodStarts, setClaimPeriodStarts] = useState<number>(0)
	const [count, setCount] = useState<number>(0)
	const toast = useToast()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		setCount((count) => count + 1)
		const interval = setInterval(() => {
			setCount((count) => count + 1)
		}, 15000)
		return () => clearInterval(interval)
	}, [])

	const claimDivaContact = {
		address: config[chain?.id]?.claimDivaLinearVestingAddress,
		abi: ClaimDivaLinearVestingABI as any,
	}

	const rewardBN = useMemo(
		() =>
			rewardInfo && rewardInfo.reward
				? parseUnits(rewardInfo.reward.toString() || '0', DIVA_TOKEN_DECIMALS)
				: ZERO_BIGNUMBER,
		[rewardInfo]
	)

	const immediateClaimableAmount = useMemo(
		() => rewardBN?.mul(40).div(100),
		[rewardBN]
	)

	const claimDivaRead = useContractReads({
    contracts: [
      {
        ...claimDivaContact,
        functionName: "trigger",
      },
      {
        ...claimDivaContact,
        functionName: "claimPeriodStarts",
      },
      {
        ...claimDivaContact,
        functionName: "claimedAmount",
        args: [userAddress],
      },
      {
        ...claimDivaContact,
        functionName: "availableDrawDownAmount",
        args: [
          rewardBN,
          rewardBN.sub(immediateClaimableAmount),
          rewardInfo.time,
          userAddress,
        ],
      },
    ],
  });

	const claimDivaWrite = useContractWrite({
    ...(claimDivaContact as any),
    functionName: "claimTokens" as never,
    args: [rewardBN, rewardInfo.time, proof] as never,
  });

	console.log({ claimDivaRead, claimDivaWrite });

	const claimDivaLinearVesting = useMemo(
    () =>
      signer && chain?.id && config[chain?.id]?.claimDivaLinearVestingAddress
        ? getContract({
            address: config[chain?.id]?.claimDivaLinearVestingAddress,
            abi: ClaimDivaLinearVestingABI,
          })
        : null,
    [chain, signer]
  );



	const currentTimestamp = useMemo(() => Math.floor(+new Date() / 1000), [])

	const claimableAmount = useMemo(
		() =>
			currentTimestamp <= claimPeriodStarts
				? ZERO_BIGNUMBER
				: currentTimestamp > claimPeriodStarts + rewardInfo.time
				? rewardBN?.sub(claimedAmount)
				: claimedAmount.gt(0)
				? availableDrawDownAmount
				: claimedAmount.eq(0)
				? immediateClaimableAmount?.add(availableDrawDownAmount)
				: ZERO_BIGNUMBER,
		[
			availableDrawDownAmount,
			immediateClaimableAmount,
			claimedAmount,
			currentTimestamp,
			claimPeriodStarts,
			rewardBN,
			rewardInfo,
		]
	)

	const claimable = useMemo(
		() =>
			rewardBN &&
			claimDivaLinearVesting &&
			trigger &&
			claimPeriodStarts &&
			currentTimestamp &&
			currentTimestamp > claimPeriodStarts,
		[
			rewardBN,
			claimDivaLinearVesting,
			trigger,
			claimPeriodStarts,
			currentTimestamp,
		]
	)

	// fetching the reward info from API
	useEffect(() => {
		const get = async () => {
			setIsLoading(true)
			const res = await fetch(`/api/rewards/${userAddress}`, {
				method: 'GET',
			})
			if (res.status === 200) {
				const json = await res.json()
				setRewardInfo(json.userReward)
				setProof(json.proof)
				setIsLoading(false)
			}
			setIsLoading(false)
		}
		if (isAddress(userAddress)) {
			get()
		}
	}, [userAddress])

	const claim = useCallback(async () => {
		if (claimableAmount.gt(0)) {
			setIsClaiming(true)
			try {
				await claimDivaWrite.writeAsync();
				setCount((count) => count + 1)
			} catch (error) {
				toast({
					title: 'Failed to claim.',
					status: 'error',
					position: 'bottom-right',
					duration: 4000,
					isClosable: true,
					variant: 'top-accent',
				})
				console.error(error)
			}
			setIsClaiming(false)
		}
	}, [claimableAmount, claimDivaWrite, toast])

	return (
		<PageLayout>
			<div
				style={{
					position: 'relative',
					zIndex: '1',
				}}>
				<Stack
					style={{
						flexDirection: 'column',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						alignContent: 'center',
						color: 'white',
						textAlign: 'center',
						zIndex: 2,
					}}
					minHeight={['90vh']}
					spacing={8}
					marginTop={rewardInfo.reward !== '' ? 20 : 0}
					className="overflow-hidden">
					<div className="z-10">
						<Stack className="justify-center items-center">
							<Image
								src="/icons/DivaTokenClaim.svg"
								alt="diavToken"
								height={128}
								width={127}
								className="mb-10"
							/>
						</Stack>
						<Heading as="h2" size="lg">
							$DIVA Token
							<Highlight> Claim</Highlight>
						</Heading>
						{userAddress === undefined && (
							<>
								<Paragraph className="mt-8 opacity-60 ">
									<a href="https://etherscan.io/token/0x4b7ffcb2b92fb4890f22f62a52fb7a180eab818e" style={{ color: '#14b8a6' }}>$DIVA</a> is the governance token of DIVA Protocol. Connect your
									wallet to determine your eligibility.
								</Paragraph>
							</>
						)}
					</div>
					{isLoading ? (
						<Skeleton
							width={500}
							height={498}
							baseColor="#202020"
							highlightColor="#444"
							style={{
								borderRadius: '12px',
								opacity: '0.5', // 50% opacity
							}}
							className="bg-opacity-5"
						/>
					) : (
						<>
							{userAddress !== undefined && rewardInfo == null && (
								<div>
									<Alert
										status="error"
										variant="subtle"
										className="text-black rounded-xl">
										<AlertIcon />
										Connected account was not registered for the testnet
									</Alert>
								</div>
							)}

							{userAddress !== undefined && rewardInfo.reward === '' && (
								<div>
									<div className="rounded-xl bg-[#472709] px-10 py-2 text-[#F2994A]">
										{'You are not eligible. Reason: ' + rewardInfo.comment}
									</div>
								</div>
							)}

							{/* {userAddress !== undefined &&
					rewardInfo.reward !== undefined &&
					rewardInfo.reward !== '' && (
						<div>
							<div>
								<div>
									<div>
										<Paragraph>Total Testnet Points</Paragraph>
										<Paragraph>{rewardInfo.points}</Paragraph>
									</div>
									<div>
										<Paragraph>Your $DIVA token reward</Paragraph>
										<Paragraph>
											{Number(rewardInfo.reward).toFixed(1)}
										</Paragraph>
									</div>
									{claimedAmount.gt(0) && (
										<div>
											<Paragraph>You already claimed:</Paragraph>
											<Paragraph>
												{toStringFixed(claimedAmount, DIVA_TOKEN_DECIMALS, 4)}
											</Paragraph>
										</div>
									)}
									<div>
										<Paragraph>Claimable amount:</Paragraph>
										<Paragraph>
											{toStringFixed(claimableAmount, DIVA_TOKEN_DECIMALS, 4)}
										</Paragraph>
									</div>
								</div>
							</div>
						</div>
					)} */}

							{userAddress !== undefined && rewardInfo.reward === undefined && (
								<div>
									<Alert
										status="error"
										variant="subtle"
										className="text-black rounded-xl">
										<AlertIcon />
										<Paragraph>You were not registered</Paragraph>
									</Alert>
								</div>
							)}

							{userAddress !== undefined &&
								rewardInfo.reward !== undefined &&
								rewardInfo.reward !== '' && (
									<TokenClaimInfo
										userAddress={userAddress}
										rewardInfo={rewardInfo}
										claim={claim}
										isClaiming={isClaiming}
										claimableAmount={claimableAmount}
										claimedAmount={claimedAmount}
									/>
								)}

							{userAddress !== undefined &&
								rewardInfo.reward !== undefined &&
								rewardInfo.reward !== '' && (
									<Stack
										className="m-8 font-sans w-[100%] md:w-[450px]"
										gap={3}>
										<Stack direction={'row'} justify={'space-between'}>
											<div className="opacity-50">
												Subject to linear vesting
											</div>

											{rewardInfo?.reward ? (
												<div className="opacity-50">
													{rewardInfo.time > 0
														? addThousandSeparators(0.6 * rewardInfo.reward)
														: addThousandSeparators(rewardInfo.reward)}
												</div>
											) : (
												<div className="opacity-50">-</div>
											)}
										</Stack>

										<Stack direction={'row'} justify={'space-between'}>
											<div className="opacity-50">Vesting duration</div>
											{/* Subject to linear vesting" is 60% * amount */}
											{rewardInfo.time <= 0 ? (
												<div className="opacity-50">-</div>
											) : (
												<div className="opacity-50">{`${
													rewardInfo.time / 31536000
												} ${
													rewardInfo.time / 31536000 > 1 ? 'years' : 'year'
												}`}</div>
											)}
										</Stack>
									</Stack>
								)}
						</>
					)}
				</Stack>
				<RewardPageBlobs />
			</div>
		</PageLayout>
	)
}

export default Rewards

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, AlertIcon, Stack } from '@chakra-ui/react'
import { BigNumber, ethers } from 'ethers'
import { isAddress, parseUnits } from 'ethers/lib/utils'

import ClaimDivaLinearVestingABI from '../abi/ClaimDivaLinearVestingABI.json'
import { config, DIVA_TOKEN_DECIMALS, ZERO_BIGNUMBER } from '../constants'
import { useAppSelector } from '../redux/hooks'
import { selectUserAddress } from '../redux/appSlice'
import { useConnectionContext } from '../hooks/useConnectionContext'
import { toStringFixed } from '../util/bn'
import { useToast } from '@chakra-ui/react'
import Image from 'next/image'
import Jazzicon from 'react-jazzicon'
import { useBreakpointValue } from '@chakra-ui/react'

/**
 * TODO: load rewards via ajax
 */
import PageLayout from '../components/pageLayout/PageLayout'
import { ConnectWalletButton } from '../components/ConnectWalletButton'
import { Heading } from '../components/typography/Heading'
import { Paragraph } from '../components/typography/Paragraph'
import { Highlight } from '../components/typography/Highlight'
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { getShortenedAddress } from '../util/getShortenedAddress'

const RewardPageBlobs = () => (
	<>
		<div
			style={{
				position: 'absolute',
				width: '726px',
				height: '594px',
				left: '1304px',
				top: 'calc(50% - 594px/2 + 46px)',
				background:
					'linear-gradient(116.38deg, rgba(0, 56, 255, 0.2) 6.37%, rgba(22, 227, 216, 0.2) 89.66%)',
				filter: 'blur(131.902px)',
				transform: 'matrix(-1, 0, 0, 1, 0, 0)',
			}}
			className="hidden md:block"></div>
		<div
			style={{
				position: 'absolute',
				width: '402px',
				height: '329px',
				left: '0px',
				top: 'calc(50% - 329px/2 + 93.5px)',
				background:
					'linear-gradient(116.38deg, rgba(0, 56, 255, 0.3) 6.37%, rgba(22, 227, 216, 0.3) 89.66%)',
				filter: 'blur(131.902px)',
				transform: 'matrix(-1, 0, 0, 1, 0, 0)',
			}}></div>
		<div
			style={{
				position: 'absolute',
				width: '402px',
				height: '329px',
				left: '821px',
				top: 'calc(50% - 329px/2 - 179.5px)',
				background:
					'linear-gradient(116.38deg, rgba(0, 56, 255, 0.3) 6.37%, rgba(22, 227, 216, 0.3) 89.66%)',
				filter: 'blur(131.902px)',
				transform: 'matrix(-1, 0, 0, 1, 0, 0)',
			}}
			className="hidden md:block"></div>
	</>
)

const TokenClaimInfo = ({
	userAddress,
	rewardInfo,
	claimable,
	claim,
	isClaiming,
	claimableAmount,
	claimedAmount,
}) => {
	const variant = useBreakpointValue({
		base: 'sm',
		md: 'md',
	})

	return (
		<Card className="md:w-[500px] min-h-[498px] px-0 py-0 font-sans">
			<Stack
				direction={'row'}
				alignItems={'center'}
				className="p-6 rounded-3xl"
				style={{
					backgroundColor: 'rgba(255, 255, 255, 0.06)',
				}}
				gap={5}>
				<div className="border-2 rounded-full overflow-hidden flex justify-center items-center p-1">
					<Jazzicon diameter={88} seed={userAddress} />
				</div>
				<div className="text-xl ">{getShortenedAddress(userAddress)}</div>
			</Stack>
			<Stack className="m-8 font-sans" gap={3}>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">Early Contributor/backer</div>
					<div>-</div>
				</Stack>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">Testnet</div>
					<div>{rewardInfo.reward.toFixed(1)}</div>
				</Stack>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">Launch partner</div>
					<div>-</div>
				</Stack>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">Quiz</div>
					<div>-</div>
				</Stack>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">DIVA Donate</div>
					<div>-</div>
				</Stack>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">888Whales holder</div>
					<div>-</div>
				</Stack>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">Other contributions/activity</div>
					<div>-</div>
				</Stack>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">Ethereum ecosystem</div>
					<div>-</div>
				</Stack>
			</Stack>
			<Stack className="m-8 mt-4 border-t-[1px] pt-6 border-white/5" gap={3}>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">$DIVA</div>
					<div>{rewardInfo.reward.toFixed(1)}</div>
				</Stack>
				<Stack direction={'row'} justify={'space-between'}>
					<div className="opacity-50">Claimable amount:</div>
					<div>{toStringFixed(claimableAmount, DIVA_TOKEN_DECIMALS, 4)}</div>
				</Stack>
				{claimedAmount.gt(0) && (
					<Stack direction={'row'} justify={'space-between'}>
						<div className="opacity-50">You already claimed:</div>
						<div> {toStringFixed(claimedAmount, DIVA_TOKEN_DECIMALS, 4)}</div>
					</Stack>
				)}
			</Stack>

			<Stack className="m-8">
				<Button
					primary
					className="justify-center"
					onClick={() => claim()}
					disabled={claimableAmount.eq(0)}
					isLoading={isClaiming}>
					{claimable ? 'Claim' : '	Rewards available after token launch'}
				</Button>
			</Stack>
		</Card>
	)
}

const Rewards = () => {
	const { address: userAddress } = useAccount()
	const { chain } = useNetwork()
	const provider = useProvider()
	const { data: signer, isError, isLoading } = useSigner()
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

	useEffect(() => {
		setCount((count) => count + 1)
		const interval = setInterval(() => {
			setCount((count) => count + 1)
		}, 15000)
		return () => clearInterval(interval)
	}, [])

	const claimDivaLinearVesting = useMemo(
		() =>
			provider && chain?.id && config[chain?.id]?.claimDivaLinearVestingAddress
				? new ethers.Contract(
						config[chain?.id]?.claimDivaLinearVestingAddress,
						ClaimDivaLinearVestingABI,
						signer
				  )
				: null,
		[chain?.id, provider, userAddress]
	)

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

	useEffect(() => {
		const get = async () => {
			const res = await fetch(`/api/rewards/${userAddress}`, {
				method: 'GET',
			})
			if (res.status === 200) {
				const json = await res.json()
				setRewardInfo(json.userReward)
				setProof(json.proof)
			}
		}
		if (isAddress(userAddress)) {
			get()
		}
	}, [userAddress])

	useEffect(() => {
		const getTrigger = async () => {
			setTrigger(await claimDivaLinearVesting.trigger())
		}
		const getClaimPeriodStarts = async () => {
			setClaimPeriodStarts(
				(await claimDivaLinearVesting.claimPeriodStarts()).toNumber()
			)
		}
		if (claimDivaLinearVesting) {
			Promise.all([getTrigger(), getClaimPeriodStarts()])
		}
	}, [claimDivaLinearVesting, count])

	useEffect(() => {
		const getClaimedAmount = async () => {
			setClaimedAmount(await claimDivaLinearVesting.claimedAmount(userAddress))
		}
		if (claimDivaLinearVesting && userAddress) {
			getClaimedAmount()
		}
	}, [claimDivaLinearVesting, userAddress, count])

	useEffect(() => {
		const getAvailableDrawDownAmount = async () => {
			setAvailableDrawDownAmount(
				await claimDivaLinearVesting.availableDrawDownAmount(
					rewardBN,
					rewardBN.sub(immediateClaimableAmount),
					rewardInfo.time,
					userAddress
				)
			)
		}
		if (
			claimDivaLinearVesting &&
			userAddress &&
			rewardBN.gt(0) &&
			immediateClaimableAmount
		) {
			getAvailableDrawDownAmount()
		}
	}, [
		claimDivaLinearVesting,
		userAddress,
		rewardBN,
		immediateClaimableAmount,
		count,
		rewardInfo,
	])

	const claim = useCallback(async () => {
		console.log('hbvjhb')
		if (claimable && claimableAmount.gt(0)) {
			setIsClaiming(true)
			try {
				console.log(rewardBN)
				console.log(rewardInfo.time)
				console.log(proof)
				const tx = await claimDivaLinearVesting.claimTokens(
					rewardBN,
					rewardInfo.time,
					proof
				)
				await tx.wait()
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
	}, [
		claimable,
		claimableAmount,
		rewardBN,
		rewardInfo.time,
		proof,
		claimDivaLinearVesting,
		toast,
	])

	return (
		<PageLayout>
			<Stack
				style={{
					flexDirection: 'column',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					alignContent: 'center',
					color: 'white',
					textAlign: 'center',
					zIndex: 10,
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
								$DIVA is the governance token of DIVA Protocol. Connect your
								wallet to determine your eligibility.
								{/* <a
									href="https://www.divaprotocol.io/posts/diva-tokenomics"
									className="hover:underline"
									target="_blank"
									rel="noreferrer">
									Learn more
									<ExternalLinkIcon />
								</a> */}
							</Paragraph>
						</>
					)}
					<Paragraph className="mt-8">
						$DIVA is the governance token for DIVA Protocol.
					</Paragraph>
				</div>
				{userAddress === undefined && (
					<>
						<Paragraph>
							Connect your wallet to determine your eligibility.
						</Paragraph>
					</>
				)}
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
							claimable={claimable}
							claim={claim}
							isClaiming={isClaiming}
							claimableAmount={claimableAmount}
							claimedAmount={claimedAmount}
						/>
					)}
			</Stack>
			<RewardPageBlobs />
		</PageLayout>
	)
}

export default Rewards

import Image from "next/image";
import { Stack } from "../components/layout/Stack";
import PageLayout from "../components/pageLayout/PageLayout";
import { Heading } from "../components/typography/Heading";
import { Highlight } from "../components/typography/Highlight";
import { Paragraph } from "../components/typography/Paragraph";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export type Post = {
  author: string;
  content: string;
  title: string;
  description: string;
  slug: string;
  date: string;
  coverImage: string;
  coverImageDescription: string;
  coverImageWidth: number;
  coverImageHeight: number;
  excerpt: string;
  featured?: boolean;
};

export default function Home() {
  return (
    <PageLayout>
      <div
        className={`relative h-[calc(100vh-5rem)] flex flex-row justify-center
      items-center bg-gradient-to-t from-[rgba(0,0,0,.7)] via-transparent radial-gradient-1`}
      >
        <Stack className="items-center relative">
          <Heading as="h1" size="xl">
            Powering the world of <Highlight>Derivatives</Highlight>
          </Heading>
          <Paragraph className="text-center text-lg">
            DIVA Protocol is a decentralized and permissionless piece of
            infrastructure that allows its users to create and settle fully
            customizable financial derivative contracts peer-to-peer.
          </Paragraph>
          <Stack vertical className="pt-5">
            <Button primary>Documentation</Button>{" "}
            <Button>Explore dApps</Button>
          </Stack>
        </Stack>
      </div>
      <Stack className="items-center relative text-center pt-20">
        <Heading as="h2" size="lg">
          <Highlight>DIVA Protocol</Highlight> powered Applications
        </Heading>
        <Paragraph className="text-center text-lg">
          Applications that you can be built on top of DIVA Protocol. No smart
          contract programming skills required.
        </Paragraph>
      </Stack>
      <Stack
        vertical
        className="pt-20 container max-w-7xl m-auto space-x-12 text-left"
      >
        <Card>
          <Stack>
            <Image
              alt="Insurance Products"
              width="100"
              height="100"
              src="/icons/InsuranceProducts.svg"
            />
            <Heading as="h3">Insurance</Heading>
            <Paragraph>
              Derivatives with payouts linked to insurance loss events such as
              natural disasters, credit default, DeFi hacks, or medical claim
              costs.
            </Paragraph>
          </Stack>
        </Card>
        <Card>
          <Stack>
            <Image
              alt="Structured Products"
              width="100"
              height="100"
              src="/icons/StructuredProducts.svg"
            />
            <Heading as="h3">Structured products</Heading>
            <Paragraph>
              Derivatives mirroring the payoff curve of barrier reverse
              convertibles and other popular structured products.
            </Paragraph>
          </Stack>
        </Card>
        <Card>
          <Stack>
            <Image
              alt="Prediction Markets"
              width="100"
              height="100"
              src="/icons/Prediction.svg"
            />
            <Heading as="h3">Prediction markets</Heading>
            <Paragraph>
              Derivatives with binary or linear payoffs that are linked to the
              outcome of sport, political or economic events.
            </Paragraph>
          </Stack>
        </Card>
      </Stack>
      <div className="py-11 pb-24 flex justify-center">
        <Button>Learn more</Button>
      </div>
      <Stack className="container max-w-7xl m-auto pt-32">
        <Heading as="h3" size="lg">
          Protocol <Highlight>Features</Highlight>
        </Heading>
        <div className="relative">
          <Stack vertical className="relative justify-between">
            <Stack className="w-1/3">
              <div className="bg-gradient-to-l rounded-lg from-[#00c2ff91] bg-opacity-30 to-transparent overflow-hidden [padding:1px] shadow-2xl">
                <div className="bg-black p-8 rounded-lg">
                  <Heading as="h3">Permissionless</Heading>
                  <Paragraph>
                    Anyone can create and settle derivatives on anything without
                    permission.
                  </Paragraph>
                </div>
              </div>
              <div className="bg-gradient-to-l rounded-lg from-[#00c2ff91] bg-opacity-30 to-transparent overflow-hidden [padding:1px] shadow-2xl">
                <div className="bg-black p-8 rounded-lg">
                  <Heading as="h3">Tradeable</Heading>
                  <Paragraph>
                    Position tokens are ERC20 and can be easily integrated into
                    any CEX or DEX.
                  </Paragraph>
                </div>
              </div>
            </Stack>
            <Stack className="w-1/3">
              <div className="bg-gradient-to-r rounded-lg from-[#00c2ff91] bg-opacity-30 to-transparent overflow-hidden [padding:1px] shadow-2xl">
                <div className="bg-black p-8 rounded-lg">
                  <Heading as="h3">Fully collateralized</Heading>
                  <Paragraph>
                    Eliminates counterparty risk and margin calls and gives
                    users a safe and frictionless experience.
                  </Paragraph>
                </div>
              </div>

              <div className="bg-gradient-to-r rounded-lg from-[#00c2ff91] bg-opacity-30 to-transparent overflow-hidden [padding:1px] shadow-2xl">
                <div className="bg-black p-8 rounded-lg">
                  <Heading as="h3">Highly customizable</Heading>
                  <Paragraph>
                    Flexible payoff profiles, any reference asset, oracle
                    agnostic, any ERC20 as collateral.
                  </Paragraph>
                </div>
              </div>
            </Stack>
          </Stack>
        </div>

        <Stack className="items-center space-y-24">
          <Heading as="h3" size="lg">
            How it <Highlight>Works</Highlight>
          </Heading>
          <Card className="max-w-lg">
            <Stack vertical>
              <Image
                src="/icons/Specify.svg"
                height="300"
                width="300"
                alt="Diva Sphere"
              />
              <div className="text-left space-y-4">
                <div className="space-y-2">
                  <Highlight className="font-sans italic inline-block">
                    Step 1:
                  </Highlight>
                  <Heading as="h3" size="sm">
                    Specify
                  </Heading>
                </div>
                <Paragraph>
                  Specify the offer terms including underlying event, payoff
                  profile and price.
                </Paragraph>
              </div>
            </Stack>
          </Card>
          <Stack vertical className="space-x-36">
            <Card className="max-w-lg mb-20">
              <Stack vertical>
                <Image
                  src="/icons/SignAndShare.svg"
                  height="300"
                  width="300"
                  alt="Sign and Share"
                />
                <div className="text-left space-y-4">
                  <div className="space-y-2">
                    <Highlight className="font-sans italic inline-block">
                      Step 2:
                    </Highlight>
                    <Heading as="h3" size="sm">
                      Sign & Share
                    </Heading>
                  </div>
                  <Paragraph>
                    Sign the offer with your private key and share it with
                    counterparties via email, chat or social media.
                  </Paragraph>
                </div>
              </Stack>
            </Card>
            <Card className="max-w-lg mt-20">
              <Stack vertical>
                <Image
                  src="/icons/Fill.svg"
                  height="300"
                  width="300"
                  alt="Fill"
                />
                <div className="text-left space-y-4">
                  <div className="space-y-2">
                    <Highlight className="font-sans italic inline-block">
                      Step 2:
                    </Highlight>
                    <Heading as="h3" size="sm">
                      Fill
                    </Heading>
                  </div>
                  <Paragraph>
                    The derivative contract is created on-chain once a
                    counterparty accepts your offer.
                  </Paragraph>
                </div>
              </Stack>
            </Card>
          </Stack>
          <Card className="max-w-lg">
            <Stack vertical>
              <Image
                src="/icons/Redeem.svg"
                height="300"
                width="300"
                alt="Sign and Share"
              />
              <div className="text-left space-y-4">
                <div className="space-y-2">
                  <Highlight className="font-sans italic inline-block">
                    Step 2:
                  </Highlight>
                  <Heading as="h3" size="sm">
                    Sign & Share
                  </Heading>
                </div>
                <Paragraph>
                  Sign the offer with your private key and share it with
                  counterparties via email, chat or social media.
                </Paragraph>
              </div>
            </Stack>
          </Card>
          <Button>
            <span className="flex space-x-3 items-center">
              <Image
                className="-m-5 mr-0"
                src="/icons/Play.svg"
                height="37"
                width="37"
                alt="Play video"
              />
              <span>Watch Video</span>
            </span>
          </Button>
        </Stack>

        <Stack className="container max-w-7xl m-auto pt-32 space-y-20">
          <Heading as="h3" size="lg">
            Our <Highlight>Partners</Highlight>
          </Heading>

          <Stack vertical className="space-x-10 justify-center items-center">
            <Image
              src="/logos/darley-logo.png"
              height="90"
              width="300"
              alt="Darley"
            />
            <span className="block [width:1px] h-24 bg-white bg-opacity-10"></span>

            <Image
              src="/logos/dwf.png"
              height="90"
              width="300"
              alt="Dwf Labs"
            />
          </Stack>
          <Stack
            vertical
            className="space-x-7 justify-center items-center py-20 border-t border-white border-opacity-10"
          >
            <Paragraph className="pr-7">Supported Networks:</Paragraph>
            <span className="rounded-md bg-white bg-opacity-10 p-2 px-4">
              <Image
                src="/logos/polygon.png"
                height="24"
                width="100"
                alt="Polygon Labs"
              />
            </span>
            <span className="rounded-md bg-white bg-opacity-10 p-2 px-4">
              <Image
                src="/logos/eth.png"
                height="24"
                width="132"
                alt="Ethereum"
              />
            </span>
            <span className="rounded-md bg-white bg-opacity-10 p-2 px-4">
              <Image
                src="/logos/arbitr.png"
                height="24"
                width="126"
                alt="Arbitrum"
              />
            </span>
          </Stack>
        </Stack>
        <Stack className="container max-w-7xl m-auto pt-32 space-y-20">
          <div className="m-auto space-y-8">
            <Heading as="h3" size="lg">
              Join the <Highlight>Conversation</Highlight>
            </Heading>
            <Paragraph>
              Our global and vibrant community drives the success of the
              Protocol. Join the conversation on Discord and Twitter to stay up
              to date on the latest community news.
            </Paragraph>
          </div>
          <Stack vertical className="justify-center space-x-10">
            <Card className="max-w-lg p-10">
              <Stack vertical className="space-x-10">
                <Image
                  className="flex-shrink-0"
                  src="/icons/Twitter.svg"
                  height="136"
                  width="136"
                  alt="Discord"
                />
                <div className="text-left space-y-4 flex-shrink">
                  <Heading as="h3" size="sm">
                    Twitter
                  </Heading>
                  <Paragraph>
                    Follow the latest news from DIVA Protocol
                  </Paragraph>
                </div>
              </Stack>
            </Card>

            <Card className="max-w-lg p-10">
              <Stack vertical className="space-x-10">
                <Image
                  className="flex-shrink-0"
                  src="/icons/Discord.svg"
                  height="136"
                  width="136"
                  alt="Discord"
                />
                <div className="text-left space-y-4 flex-shrink">
                  <Heading as="h3" size="sm">
                    Discord
                  </Heading>
                  <Paragraph>
                    Ask questions and engage with the DIVA Community
                  </Paragraph>
                </div>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </Stack>
    </PageLayout>
  );
}

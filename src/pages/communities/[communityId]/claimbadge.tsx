import { type NextPage } from "next";
import Image from 'next/image';
import { useRouter } from "next/router";
import { memo } from 'react';
import { ICommunityInfo } from "../../../data/interfaces";
import communityIcon from "../../../images/community_icon.svg";
import badgeIcon from "../../../images/badge_icon.svg";
import badgeStar1 from "../../../images/badge_star1.svg";
import badgeStar2 from "../../../images/badge_star2.svg";

const mockData: ICommunityInfo = {
    community_id: 1,
    community_owner: "vself.near",
    community_name: "vSelf DAO",
    community_description: "Web3 identity wallet with for data",
    community_source_image: communityIcon,
    members: [],
    public_members: [],
    badge_name: "vSelf Member",
    badge_description: "web3 identity wallet with rewards for data sharing",
    badge_source_image: badgeIcon
}

const ClaimBadge: NextPage = memo(() => {
    const router = useRouter();

    const handleNaviagte = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined, path: string) => {
        e?.preventDefault();
        router.push(path);
    };

    return (
        <div className="bg-white rounded-[20px] text-[#3D3D3D] relative">
            <div className="absolute w-[150px] left-[-75px] top-[calc(50%-75px)]">
                <Image
                    layout="responsive"
                    src={badgeStar1}
                    alt="star2"
                />
            </div>

            <div className="px-[80px] py-[40px]">
                <div className="flex items-center space-x-[50px]">
                    <div className="flex-none w-[125px] rounded-full">
                        <Image
                            layout="responsive"
                            src={mockData.community_source_image}
                            alt="community_source_image"
                        />
                    </div>
                    <div className="flex-initial w-[400px] text-left">
                        <h1 className="text-[20px] leading-10 font-extrabold mb-[15px]">{mockData.community_name}</h1>
                        <h3 className="text-[16px] leading-5 font-normal">{mockData.community_description}</h3>
                    </div>
                </div>

                <div className="main-blue-bg rounded-[20px] text-[26px] leading-[30px] px-[60px] py-[25px] text-left tracking-[0.12em] my-[30px] text-white font-extrabold relative">
                    <div className="absolute w-[150px] top-[-75px] right-[50px]">
                        <Image
                            layout="responsive"
                            src={badgeStar2}
                            alt="star2"
                        />
                    </div>
                    <div>Attention!</div>
                    <div>The membership badge is a non-transferable<br />NFT and will be seen on NEAR blockchain</div>
                </div>

                <div className="flex items-center space-x-[50px]">
                    <div className="flex-none w-[125px] rounded-full">
                        <Image
                            layout="responsive"
                            src={mockData.badge_source_image!}
                            alt="badge_source_image"
                        />
                    </div>
                    <div className="flex-initial w-[400px] text-left">
                        <h1 className="text-[20px] leading-10 font-extrabold mb-[15px]">{mockData.badge_name}</h1>
                        <h3 className="text-[16px] leading-5 font-normal">{mockData.badge_description}</h3>
                    </div>
                    <div className="flex-initial w-48">
                        <button className="w-full main-green-bg py-[5px] rounded-full font-medium">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ClaimBadge;
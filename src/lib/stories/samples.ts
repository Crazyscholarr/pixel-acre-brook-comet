import { cleanText } from "@/lib/processors/cleaner";
import { localizeStory } from "@/lib/processors/localizer";
import { wordCount } from "@/lib/utils";
import type { Story } from "./types";

function stamp(opts: {
  id: string;
  source: Story["source"];
  title: string;
  raw: string;
  localizedTitle: string;
  localized: string;
  language: Story["language"];
  tags: string[];
  url?: string;
}): Story {
  const cleaned = cleanText(opts.raw);
  const loc = localizeStory(opts.title, cleaned, { seed: opts.id.length * 19 });
  const now = "2026-08-18T08:00:00.000Z";
  return {
    id: opts.id,
    source: opts.source,
    sourceUrl: opts.url,
    titleOriginal: opts.title,
    titleLocalized: opts.localizedTitle,
    rawContent: opts.raw.trim(),
    cleanedContent: cleaned,
    localizedContent: opts.localized.trim(),
    language: opts.language,
    status: "localized",
    blockedHits: loc.blockedHits,
    nameMap: loc.nameMap,
    placeMap: loc.placeMap,
    createdAt: now,
    updatedAt: now,
    tags: opts.tags,
    wordCount: wordCount(opts.localized),
    crawlNote: "Bản mẫu dựng sẵn — nguồn live có thể bị chặn hoặc cần cookie.",
  };
}

const ZHIHU_RAW = `我叫李娜，嫁到北京已经六年。丈夫张伟是某集团的总裁，每天开车进出CBD的写字楼。他的白月光王芳突然成了公司新秘书，绿茶一杯接一杯送到张伟办公桌上。

婆婆住在我们的高档小区。她看我不顺眼，说我不会生儿子，只会花钱。有一天晚饭，王芳“碰巧”来送文件。婆婆拉着她的手说：“这才是豪门该有的儿媳。”

我当时端着碗，手在抖。张伟只是低头看手机，像一个路过的人。夜里我去阳台，北京的夜全是灯，可没有一盏是为我亮的。

第二天我回了娘家杭州。妈妈说，你可以忍，也可以走。我把婚纱照片从相册里抽出来，一张一张撕掉。那些照片里的我还以为嫁进豪门就是幸福。

后来我在杭州找了份普通工作。不再等那个总裁，也不再跟绿茶争。有人问我恨不恨。我说恨过，但恨太累。我只想过自己的日子。`;

const ZHIHU_VI = `Tôi tên Trần Thị Mai, lấy chồng về xã Tân Phong, huyện Cai Lậy, tỉnh Tiền Giang đã sáu năm. Chồng tôi, Nguyễn Văn Hùng, làm thủ quỹ hợp tác xã, ngày nào cũng chạy xe máy ra nhà văn hóa xã. Người cũ của anh — Phạm Thị Hương — đột nhiên về làm sổ sách, ngày ngày mang nước mía vào bàn làm việc của Hùng.

Mẹ chồng ở cùng xóm nhà tường gạch. Bà không ưa tôi, bảo tôi không sinh được trai, chỉ biết tiêu. Một bữa cơm chiều, Hương “tình cờ” mang giấy tờ qua. Bà nắm tay cô ấy: “Thế mới đúng con dâu nhà khá giả trong huyện.”

Tôi đang bưng chén, tay run. Hùng chỉ cúi nhìn điện thoại, như người đi ngang. Đêm ấy tôi ra sân phơi lúa. Đèn xóm sáng hết, không có ngọn nào vì tôi.

Hôm sau tôi về nhà mẹ ở làng Đông Hồ, huyện Thuận Thành, tỉnh Bắc Ninh. Má nói, con chịu được thì chịu, không thì về. Tôi rút ảnh ngày cưới, xé từng tấm. Trong ảnh, tôi tưởng lấy chồng nhà khá giả là hết khổ.

Sau này tôi xin phụ bán ở chợ phiên. Không đợi thủ quỹ nữa, cũng không tranh với người thứ ba. Có người hỏi tôi có hận không. Tôi nói hận rồi, nhưng hận mệt lắm. Tôi chỉ muốn sống ngày của mình.`;

const FOLK_RAW = `很久很久以前，苏州有个叫阿福的青年。他每天去田里干活，傍晚总会经过村口的老槐树。树上住着一只狐狸，修炼了三百年，化成一个穿青衣的姑娘。

姑娘说：“你每天给我留下一个馒头，我就让你的稻谷比别人多收三成。”阿福答应了。三年里，他真的富裕起来，娶了邻村的阿秀。

可阿秀发现丈夫总在树下说话，起了疑心。她带着剪刀去剪狐狸的尾巴。狐狸受伤逃进山里，临走留下一句话：“人心比狐狸精还厉害。”

从那以后，阿福的田再也长不出好稻子。他才明白，有些恩情，是不能用剪刀去量的。`;

const FOLK_VI = `Ngày xưa, ở xã Phú Mỹ, huyện Phú Tân, tỉnh An Giang, có chàng trai tên Lê Văn Phúc. Ngày nào Phúc cũng ra đồng, chiều về đều đi qua cây đa trước miếu. Trên cây có một hồ ly tu ba trăm năm, hóa thành cô gái áo bà ba màu chàm.

Cô nói: “Mỗi ngày anh để lại cho tôi một nắm xôi, tôi sẽ cho lúa nhà anh được hơn người ba phần.” Phúc nhận lời. Ba năm sau nhà khá giả, cưới cô gái xóm dưới tên Phạm Thị Hà.

Hà thấy chồng hay đứng gốc đa thì sinh nghi. Chị mang kéo ra cắt đuôi hồ ly. Hồ ly bị thương chạy lên rẫy, để lại một câu: “Lòng người còn hơn hồ ly.”

Từ đó ruộng nhà Phúc không lên lúa nữa. Anh mới hiểu: ơn nghĩa không đo bằng lưỡi kéo.`;

const GHOST_RAW = `长沙老巷里有一栋民国小楼，没人敢住。据说楼上的镜子里会走出一个女人，叫人跟她回家。

木匠老周不信邪，接了活去修楼。第一夜，他听见楼上有人梳头。第二夜，镜子里真的出现一张苍白的脸。女人说：“我等了八十年，只想有人叫我一声阿娘。”

老周把女儿的乳名告诉了镜子。第二天，镜子碎了，楼里的潮气散尽。有人问他怕不怕。他说：“鬼不可怕，被人忘记才可怕。”`;

const GHOST_VI = `Trong làng cổ Phước Tích, huyện Phong Điền, Thừa Thiên Huế, có căn nhà rường bỏ trống, không ai dám ở. Người ta bảo trong tấm gương gỗ mun sẽ bước ra một người đàn bà, gọi kẻ lạ về với mình.

Thợ mộc ông Tư không tin, nhận lời tu bổ. Đêm thứ nhất, ông nghe trên gác có tiếng chải đầu. Đêm thứ hai, gương hiện một khuôn mặt tái. Bà nói: “Tôi đợi tám mươi năm, chỉ muốn có người gọi một tiếng má.”

Ông Tư nói với gương tên cúng cơm của con gái. Sáng hôm sau gương vỡ, hơi ẩm trong nhà tan. Có người hỏi ông có sợ không. Ông bảo: “Ma không đáng sợ. Bị quên mới đáng sợ.”`;

const REDDIT_RAW = `AITA for refusing to host Thanksgiving at my apartment in New York after my mother-in-law called my wife a failure?

I (34M) and my wife Sarah (32F) live in a one-bedroom in Brooklyn. My mother, Linda, usually hosts, but this year she asked us to do it because she is remodeling her house in Manhattan.

Sarah has been working double shifts at the hospital. When Linda came over last weekend she looked at our table and said, "I guess some women just can't keep a home. Michael would have done better with his ex." She meant my white moonlight, Jessica, who now works as a CEO's assistant.

I told Linda she is not welcome in our apartment unless she apologizes. My brother says I am destroying the family over one comment. Sarah cried in the kitchen for an hour. I don't think I am the asshole, but the group chat is on fire.`;

const REDDIT_VI = `Tôi có độc không khi cấm mẹ không được tới nhà cấp bốn ăn Tết, sau khi bà gọi vợ tôi là đồ thất bại?

Tôi (34 tuổi) và vợ Trần Thị Lan (32) ở nhà cấp bốn xóm dưới, xã Tân Phong. Thường thì má tôi — bà Năm — đãi Tết, năm nay bà bảo vợ chồng tôi làm vì bà đang sửa nhà xóm trên.

Lan đang trực đôi ca ở trạm y tế xã. Cuối tuần bà Năm sang, nhìn mâm cơm rồi nói: “Có người đàn bà không biết giữ nhà. Hùng lấy người cũ thì khá hơn.” Bà muốn nói tới Phạm Thị Hương, nay làm sổ sách cho chủ cơ sở.

Tôi bảo bà Năm không bước chân vào nhà nếu chưa xin lỗi. Anh tôi nói tôi phá nhà vì một câu. Lan khóc trong bếp một tiếng đồng hồ. Tôi không nghĩ mình sai, nhưng nhóm Zalo họ hàng đang dậy sóng.`;

const FANQIE_RAW = `第一章 回乡

陈静在深圳待了十一年，在集团做秘书，天天给总裁送咖啡。那年冬天，父亲病了，她买了张火车票回到成都乡下。

村口的土路还是那样。弟弟陈磊在田边抽烟，说家里的地要被征，村长的少爷看上了这块地。陈静把高跟鞋换成交鞋，第一件事是去翻父亲的土地本。

村里有人笑她：“城里的美女也要来抢地？”她不说话。夜里她坐在老屋门槛上，听蛙鸣，忽然觉得深圳那些写字楼都像纸做的。

白月光也好，绿茶也好，都离这片稻田很远。她只想把地留下来。`;

const FANQIE_VI = `Chương một — Về quê

Lê Thị Hoa ở làng gốm Bát Tràng mười một năm, làm sổ sách hợp tác xã, ngày ngày bê nước trà cho chủ cơ sở. Mùa đông ấy ba ốm, chị mua vé xe đò về xã Quỳnh Đôi, huyện Quỳnh Lưu, tỉnh Nghệ An.

Đường đất đầu làng vẫn thế. Em trai Lê Văn Đức ngồi bờ ruộng hút thuốc, nói đất nhà sắp bị thu, con nhà khá giả của trưởng thôn để mắt tới. Hoa cởi dép cao, việc đầu tiên là mở sổ ruộng của ba.

Xóm có người cười: “Cô gái dưới tỉnh cũng về giành đất?” Chị không đáp. Đêm ngồi ngưỡng cửa nhà cấp bốn, nghe ếch, chợt thấy mấy gian nhà văn hóa xã nơi kia mỏng như giấy.

Người cũ cũng được, người thứ ba cũng được — đều cách xa đám lúa này. Chị chỉ muốn giữ đất.`;

export function createSampleStories(): Story[] {
  return [
    stamp({
      id: "sample_zhihu_01",
      source: "zhihu",
      title: "我的总裁丈夫和她的白月光",
      raw: ZHIHU_RAW,
      localizedTitle: "Chồng tôi và người cũ của anh ấy",
      localized: ZHIHU_VI,
      language: "zh",
      tags: ["mẹ chồng", "nàng dâu", "盐选"],
      url: "https://www.zhihu.com/xen/market/sample",
    }),
    stamp({
      id: "sample_660i_folk",
      source: "i660",
      title: "槐树下的青衣姑娘",
      raw: FOLK_RAW,
      localizedTitle: "Cô gái áo chàm dưới cây đa",
      localized: FOLK_VI,
      language: "zh",
      tags: ["民间故事", "cat_703"],
      url: "https://660i.com/story/cat_703",
    }),
    stamp({
      id: "sample_660i_ghost",
      source: "i660",
      title: "镜子里的阿娘",
      raw: GHOST_RAW,
      localizedTitle: "Người trong gương gỗ mun",
      localized: GHOST_VI,
      language: "zh",
      tags: ["鬼故事", "cat_710"],
      url: "https://660i.com/story/cat_710",
    }),
    stamp({
      id: "sample_reddit_01",
      source: "reddit_aita",
      title: "AITA for banning my mother from Thanksgiving?",
      raw: REDDIT_RAW,
      localizedTitle: "Tôi có độc không khi cấm mẹ ăn Tết ở nhà mình?",
      localized: REDDIT_VI,
      language: "en",
      tags: ["AITA", "gia đình"],
      url: "https://www.reddit.com/r/AmItheAsshole/",
    }),
    stamp({
      id: "sample_fanqie_01",
      source: "fanqie",
      title: "回乡 · 第一章",
      raw: FANQIE_RAW,
      localizedTitle: "Về quê · Chương một",
      localized: FANQIE_VI,
      language: "zh",
      tags: ["dài kỳ", "phần 1"],
      url: "https://fanqienovel.com/sample",
    }),
  ];
}

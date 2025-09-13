const {
    EmbedBuilder,
    ApplicationCommandType,
} = require('discord.js')

module.exports = {
    name: "hack",
    description: "\"hacks\" someone!",
    category: "fun",
    cooldown: 5000,
    type: ApplicationCommandType.ChatInput,
    userPerms: [],
    botPerms: [],
    options: [{
        name: "target",
        description: "Input the target in which I am going to hack!",
        required: true,
        type: 6,
    }],

    async run({
        client,
        interaction
    }) {

        const passwords = [
            "password123", "1234567", "AA29103", "Frog23441", "ThisIsAGoodPassword", "HelloThere", "never gonna give you up",
            "Dj2@D12", "XhdiE214!", "ILoveCats2010", "Wolffi847!", "wedonthave1", "CaThedJ29##!", "992018432", "ineedapassword", "ImAFurry",
            "Epic2nz", "Secret...?"
        ]

        const ip = [
            Math.floor(Math.random() * 256),
            ".",
            Math.floor(Math.random() * 256),
            ".",
            Math.floor(Math.random() * 256),
            ".",
            Math.floor(Math.random() * 256),
        ].join('')

        const address = [
            "42 Hanover St.Staunton, VA 24401",
            "2 Pennsylvania St.Munster, IN 46321",
            "83 Rockwell Dr.Brownsburg, IN 46112",
            "273 Foxrun Street Richmond Hill, NY 11418",
            "69 Branch Rd.Skokie, IL 60076",
            "3 NW. Cedarwood Lane Copperas Cove, TX 76522",
            "9853 Creekside Avenue Dickson, TN 37055",
            "9851 Thorne Court Garner, NC 27529",
            "691 Arnold St.Augusta, GA 30906",
            "9352 Buckingham Road Chesterton, IN 46304",
            "6 Lakewood Dr.Kennewick, WA 99337",
            "61 La Sierra Street Morrisville, PA 19067",
            "292 Orange Court Sun Prairie, WI 53590",
            "16 Brookside Ave.Boston, MA 02127",
            "7510 Fifth Court Toms River, NJ 08753",
            "749 Water St.North Kingstown, RI 02852",
            "287 Orchard Street Upper Darby, PA 19082",
            "9378 Courtland Ave.Bethlehem, PA 18015",
            "119 Selby Ave.Clarkston, MI 48348",
            "202 Thatcher St.Hillsborough, NJ 08844",
        ]
        const name = [
            "Billy Bob Joe",
            "Jimmy Bob Joe",
            "chupacabras",
            "makaco",
            "Tom Swords",
            "Bob Smith",
            "Jennifer Whemper",
            "Amy Chamberlain",
            "Melissa Downs",
            "Alyssa Kim",
            "Tyler Frog",
            "Men Trees",
            "Mary Shumway",
            "Angela Wallin",
            "Caleb Greenberg",
            "Voldomyr Nocturne",
            "Niklaus Kirishiki",
            "Julian Grippen",
            "Abby Smallcock",
            "Aqua Tanner",
            "Julian Vartasha",
            "Ben Death",
            "Amblish Lkaska",
            "Storm Blackthorn",
            "Blizzard Blackthorn",
            "SandStorm Blackthorn",
            "Kevin Duro",
        ]


        const phone = [
            "(",
            Math.floor(Math.random() * 9) + 1,
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            ")",
            "-",
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            "-",
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
        ].join('')

        const email = [
            "athena51@gmail.com",
            "christopher44@hotmail.com",
            "daniella.kunze@yahoo.com",
            "tianna.nienow@yahoo.com",
            "adolph.dach37@hotmail.com",
            "athena19@gmail.com",
            "marina.reichert@hotmail.com",
            "renee_hermiston@hotmail.com",
            "elinore_kessler30@gmail.com",
            "maudie44@hotmail.com",
            "arnold33@hotmail.com",
            "ida92@yahoo.com",
            "dewayne.reichert@yahoo.com",
            "neha.king7@hotmail.com",
            "dallas_bergnaum@yahoo.com",
            "hester.bartell@gmail.com",
            "helene.bruen@gmail.com",
            "zelma.haley60@yahoo.com",
            "griffin.larson@yahoo.com",
            "nicklaus42@hotmail.com",
            "adaline_corkery18@gmail.com",
            "felicita.grady59@gmail.com",
            "antonia.frami81@yahoo.com",
            "mayra_johnson@yahoo.com",
            "kaley_oconnell@gmail.com",
            "sonia_larson@gmail.com",
            "lillian.kerluke@hotmail.com",
            "deven38@gmail.com",
            "annabel.weimann99@yahoo.com",
            "herminio.steuber@hotmail.com",
        ]
        const { options } = interaction;
        const victim = options.getUser('target')
        const author = interaction.member.user

        if (victim.id === interaction.user.id) return interaction.reply("You can not hack yourself!")
        if (victim.id === client.id) return interaction.reply("I am not going to hack myself, sorry!")

        interaction.reply("\`\`\`Diff\n+ Booting up system.....\n- {#_________}\`\`\`").then(() => {
            setTimeout(() => {
                interaction.editReply("\`\`\`Diff\n+ System starting.......\n- {##________}\`\`\`")
            }, 2500)
            setTimeout(() => {
                interaction.editReply("\`\`\`Diff\n+ System started! Bypassing firewall.....\n- {###_______}\`\`\`")
            }, 5500)
            setTimeout(() => {
                const fail = Math.round(Math.random() * 10) + 1
                if (fail <= 3) {
                    interaction.editReply("\`\`\`Diff\n- Firewall bypassed failed! Strong anti virus detected. Hacked failed, exiting system..........\n- {ERROR: unexpected stop at system. Anti Virus found. Exit system NOW before anti virus back tracks.........}\`\`\`")
                    setTimeout(() => {
                        interaction.editReply("\`\`\`Diff\n- System exiting.....\n- {ERROR: unexpected stop at system. System exited. System wiped and shut down. Restarting.........}\`\`\`")
                    }, 3500)
                    setTimeout(() => {
                        return interaction.editReply("\`\`\`Diff\n- System exited.\n- {ERROR: undefined.}\`\`\`")
                    }, 5500)
                } else {
                    interaction.editReply("\`\`\`Diff\n+ Fire wall bypassed, hacking password.......\n- {####______}\`\`\`")
                    setTimeout(() => {
                        interaction.editReply("\`\`\`Diff\n+ Password granted. Fetching other personal info.......\n- {#####_____}\`\`\`")
                    }, 2500)
                    setTimeout(() => {
                        interaction.editReply("\`\`\`Diff\n+ Finished fetching personal info. Selling data to the Russian government..........\n- {######____}\`\`\`")
                    }, 5000)
                    setTimeout(() => {
                        interaction.editReply("\`\`\`Diff\n+ Finished hacking. Creating backdoors for easy access.........\n- {#######___}\`\`\`")
                    }, 8000)
                    setTimeout(() => {
                        interaction.editReply("\`\`\`Diff\n+ Backdoor created. Injecting viruses......\n- {########__}\`\`\`")
                    }, 11000)
                    setTimeout(() => {
                        interaction.editReply(`\`\`\`Diff\n+ Finished hacking ${victim.tag}.\n- {#########_ -- finished. Generating final report.......}\`\`\``)
                    }, 15000)
                    setTimeout(() => {
                        interaction.editReply(`\`\`\`Diff\n+ Final hacking reprot generated for ${victim.tag}. Exiting system. \n- {########## -- System exited.......}\`\`\``)
                        interaction.channel.send({
                            embeds: [
                                new EmbedBuilder()
                                .setAuthor({
                                    name: " || " + interaction.guild.name,
                                    iconURL: interaction.guild.iconURL() || client.user.displayAvatarURL()
                                })
                                .setTitle(`Hacking result for: ${victim.tag}`)
                                .setDescription('Finished hacking: 2FA bypass.')
                                .setThumbnail('https://cdn1.vectorstock.com/i/1000x1000/01/05/message-you-have-been-hacked-vector-20550105.jpg')
                                .setColor('#0a0a0a')
                                .addFields({
                                    name: `Password:`,
                                    value: passwords[Math.floor(Math.random() * passwords.length)],
                                    inline: true,
                                }, {
                                    name: `IP address:`,
                                    value: ip,
                                    inline: true,
                                }, {
                                    name: `Address:`,
                                    value: address[Math.floor(Math.random() * address.length)],
                                    inline: true,
                                }, {
                                    name: `Data Sold for:`,
                                    value: `${Math.floor(Math.random() * 10000) + 1000} USD`,
                                    inline: true,
                                }, {
                                    name: `Enjected virus:`,
                                    value: `${Math.round(Math.random() * 40) + 5}`,
                                    inline: true,
                                }, {
                                    name: `Real name:`,
                                    value: name[Math.floor(Math.random() * name.length)],
                                    inline: true,
                                }, {
                                    name: 'Username:',
                                    value: victim.username,
                                    inline: true,
                                }, {
                                    name: 'Phone Number:',
                                    value: `${phone}`,
                                    inline: true,
                                }, {
                                    name: 'Email:',
                                    value: email[Math.floor(Math.random() * email.length)],
                                    inline: true,
                                })
                                .setFooter({
                                    text: `${victim.tag} hacked by: ${author.tag}`,
                                    iconURL: author.displayAvatarURL(),
                                })
                                .setTimestamp()
                            ]
                        })
                    }, 17000)
                }
            }, 8000)

        })
    }
}
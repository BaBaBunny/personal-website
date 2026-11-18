import cuabLogo from '../../assets/CUAB.png';
import cuab1 from '../../assets/CUAB1.png';
import cuab2 from '../../assets/CUAB2.png';
import cuabTitle from '../../assets/CUABtitle.png';
import restReminderLogo from '../../assets/eyeHD.png';
import restReminderLockup from '../../assets/lookaway.jpeg';
import myBad1 from '../../assets/mybad1.png';
import myBad2 from '../../assets/mybad2.png';
import myBadTitle from '../../assets/mybadtitle.png';
import placeholderBanner from '../../assets/placeholder.jpg';
import restReminderPopup from '../../assets/restreminderPopup.jpeg';

export const csProjects = [
    {
        title: '20/20/20 Rest Reminder',
        description: 'Chrome extension that reminds you to take eye breaks every 20 minutes.',
        banner: restReminderLogo,
        details: 'A chrome extension made to help remind you to rest and relax your eyes when working in front of a screen for long periods of time.',
        readMore: [
            'I use screens a lot and have hours of exposure every day non-stop, so I developed this wellness chrome extension that reminds you to take a quick break and rest your eyes. It is a simple and efficient rule to keep track of and can be integrated into your routine pretty easily. And it works! I use it all the time.',
            'I made the logo in Canvas',
            'I intentionally designed the UI to look bare and clean to remove distractions yet keeping the UI intuitive. This encourages you to actually look away.',
            'The main feature of this rest reminder aside from the actual reminder, is the state persistence and how it blocks the user from attempting to switch tabs, delete, refresh, you name it. It essentially temporarily disables your browser until the break is over. Making it non-negotiable and adding more friction.'
        ],
        projectLink: 'https://chromewebstore.google.com/detail/202020-rest-reminder/molchoajjnbonjheonbagieggidaoile',
        repoLink: 'https://github.com/BaBaBunny/20-20-20-chrome-extension',
        galleryImages: [restReminderLogo, restReminderLockup, restReminderPopup],
    },
        {
        title: 'Clean Up at BaBas',
        description: 'A 2D top-down survival horror cleaning game.',
        banner: cuabLogo,
        details: 'You are a janitor taking in a night shift at BaBas. But as you clean along you realize you are not alone.',
        readMore: [
            'Made in Unity.'
        ],
        projectLink: 'https://bababunny.itch.io/cleanupatbabas',
        repoLink: 'https://github.com/username/repo-name',
        galleryImages: [cuabTitle, cuab1, cuab2],
    },
    {
        title: 'My Bad',
        description: 'A 2D systemic strategy-defense game created for Queens QGDC Fall 2026 Game Jam with the theme of Chain-Reaction/Cascade.',
        banner: myBadTitle,
        details: 'You are gifted the powerful forces of nature and now must protect the villagers of the island.',
        readMore: [
            'Made in Unity.',
            '13th place overall out of 17 entries from a score of 3.3.'
        ],
        projectLink: 'https://bababunny.itch.io/my-bad',
        repoLink: 'https://github.com/username/repo-name',
        galleryImages: [myBad1, myBad2],
    },
    {
        title: 'More Projects Coming Soon/In the Works...',
        description: 'This panel is a placeholder for upcoming CS work.',
        banner: placeholderBanner,
        isPlaceholder: true,
        details: 'why u peeking, nothing to look at here :)',
        readMore: [
            'This section will expand as more projects are shipped, with development screenshots, progress notes, and links.',
        ],
        projectLink: 'https://example.com/project-link',
        repoLink: 'https://github.com/username/repo-name',
        galleryImages: [placeholderBanner, placeholderBanner, placeholderBanner],
    },
];

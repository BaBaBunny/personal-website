import restReminderLogo from '../../assets/eyeHD.png';
import restReminderLockup from '../../assets/lookaway.jpeg';
import placeholderBanner from '../../assets/placeholder.jpg';
import restReminderPopup from '../../assets/restreminderPopup.jpeg';

export const csProjects = [
    {
        title: '20/20/20 Rest Reminder',
        description: 'Chrome extension that reminds you to take eye breaks every 20 minutes.',
        banner: restReminderLogo,
        details: 'A chrome extension made to help remind you to rest and relax your eyes when working in front of a screen for long periods of time.',
        readMore: [
            'An extension to help remind you to take a break every 20 minutes for 20 seconds by looking at something 20 feet away.',
            'Start the timer and it will automatically count down 20 minutes.',
            'After the 20 minutes, you current chrome tab will lock and prevent you from accessing other tabs, ensuring you rest for 20 seconds.',
            'Users should have this if they are constantly facing a screen. This creates long term strain on eyes, so having this app, is simply a helpful tool to reduce strain.'
        ],
        projectLink: 'https://chromewebstore.google.com/detail/202020-rest-reminder/molchoajjnbonjheonbagieggidaoile',
        repoLink: 'https://github.com/BaBaBunny/20-20-20-chrome-extension',
        galleryImages: [restReminderLogo, restReminderLockup, restReminderPopup],
    },
    {
        title: 'More Projects Coming Soon...',
        description: 'This panel is a placeholder for upcoming CS work.',
        banner: placeholderBanner,
        details: 'why u peeking, nothing to look at here :)',
        readMore: 'This section will expand as more projects are shipped, with development screenshots, progress notes, and links.',
        projectLink: 'https://example.com/project-link',
        repoLink: 'https://github.com/username/repo-name',
        galleryImages: [placeholderBanner, placeholderBanner, placeholderBanner],
    },
    
];

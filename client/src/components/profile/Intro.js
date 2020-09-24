import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCurrentUserProfile } from '../../actions';
import AdvancedFormat from 'dayjs/plugin/advancedFormat'; // ES 2015
import Skeleton from 'react-loading-skeleton';

import dayjs from 'dayjs';
import {
  makeStyles,
  Avatar,
  Button,
  Typography,
  Card,
  Chip,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import RoomIcon from '@material-ui/icons/Room';
import EmojiFlagsIcon from '@material-ui/icons/EmojiFlags';

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import GitHubIcon from '@material-ui/icons/GitHub';
import CakeOutlinedIcon from '@material-ui/icons/CakeOutlined';

import defaultAvatar from '../../assets/img/default.jpg';
import EditProfileDialog from './diloags/EditProfileDialog';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: theme.spacing(2) },
  coverSection: {
    height: 150,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  userName: { textTransform: 'capitalize' },
  avatarWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(4),
    marginTop: -140,
  },
  avatar: {
    height: theme.spacing(17),
    width: theme.spacing(17),
    marginBottom: theme.spacing(2),
  },
  avatarLeft: {},
  bio: {
    textAlign: 'center',
  },
  infoBox: {
    display: 'inline-flex',
    alignItems: 'flex-end',
    border: '1px solid #555',
    padding: '6px 16px',
    marginRight: '7px',
    borderRadius: theme.spacing(3),
  },
  skillsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skills: {
    display: 'block',
    margin: '30px 0',
  },
  skill: {
    marginRight: 7,
  },
  rightIntro: {},
}));

function Intro(props) {
  const classes = useStyles();

  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const handleOpenEdit = () => {
    setOpenEditDialog(true);
  };
  const handleCloseEdit = () => {
    setOpenEditDialog(false);
  };

  useEffect(() => {
    props.getCurrentUserProfile();
  }, []);
  dayjs.extend(AdvancedFormat); // use plugin

  return (
    <Card className={classes.root}>
      <div>
        <div
          className={classes.coverSection}
          style={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
          }}
        >
          cover
        </div>
        <div className={classes.avatarSection}>
          <div className={classes.avatarWrapper}>
            <div className={classes.avatarLeft}>
              <Avatar
                className={classes.avatar}
                src={props.user ? props.user.avatar : ''}
              />
              <div>
                <Typography
                  variant="h5"
                  className={classes.userName}
                  display="block"
                >
                  {props.user ? props.user.firstName : <Skeleton />}{' '}
                  {props.user ? props.user.lastName : ''}
                </Typography>
                <Typography variant="caption" gutterBottom>
                  {props.profile ? props.profile.title : <Skeleton />} at{' '}
                  {props.profile ? props.profile.company : ''}
                </Typography>
                <Typography display="block" variant="subtitle1">
                  {props.profile ? props.profile.status : <Skeleton />}
                </Typography>

                <div className={classes.metaSection}>
                  <div className={classes.skillsWrapper}>
                    <div className={classes.skills}>
                      {props.profile &&
                        props.profile.skills.map((skill) => {
                          return (
                            <Chip
                              className={classes.skill}
                              size="small"
                              label={skill}
                            />
                          );
                        })}
                    </div>
                  </div>
                  <div className={classes.infoBox}>
                    <RoomIcon style={{ marginRight: 7 }} />
                    <div>Boston , MY</div>
                  </div>
                  {/* <div className={classes.infoBox}>
                    <CakeOutlinedIcon style={{ marginRight: 7 }} />
                    <div>15 mai</div>
                  </div> */}
                  <div className={classes.infoBox}>
                    <EmojiFlagsIcon style={{ marginRight: 7 }} />
                    <div>
                      Joined{' '}
                      {props.user ? (
                        dayjs(props.user.createdAt).format('MMMM D, YYYY')
                      ) : (
                        <Skeleton />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.rightIntro}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenEdit}
                style={{ marginBottom: 30 }}
                startIcon={<EditIcon />}
              >
                edit profile
              </Button>
              <EditProfileDialog
                openEditDialog={openEditDialog}
                handleClickOpenEdit={openEditDialog}
                handleCloseEdit={handleCloseEdit}
              />
              <div>
                <a href="/">
                  <FacebookIcon style={{ marginLeft: 7, color: '#1877F2' }} />
                </a>
                <a href="/">
                  <TwitterIcon style={{ marginLeft: 7, color: '#1DA1F2' }} />
                </a>
                <a href="/">
                  <InstagramIcon style={{ marginLeft: 7, color: '#E1306C' }} />
                </a>
                <a href="/">
                  <GitHubIcon style={{ marginLeft: 7, color: '#333' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    profile: state.userProfile.profile,
  };
};
export default connect(mapStateToProps, { getCurrentUserProfile })(Intro);
